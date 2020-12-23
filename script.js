async function getTeams( s){
    let req = new Request("https://api.collegefootballdata.com/teams");
    let json = await req.loadJSON();
    let team;
    json.map(tea => {
        if(tea.school == s){
    //         team = tea;
            team = tea.logos[0]
        }
    })
    
    return team 
    
    
    }


    async function getTeamColor( s){
        let req = new Request("https://api.collegefootballdata.com/teams");
        let json = await req.loadJSON();
        let color;
        json.map(tea => {
            if(tea.school == s){
        //         team = tea;
               color = tea.color
            }
        })
        
        return color
        
        
        }


    
    
    
    async function getGames(s){
        let req = new Request("https://api.collegefootballdata.com/games?year=2020")
        let json = await req.loadJSON();
        let game =  []; 
        json.map(gam => {
            if(gam.home_team == s || gam.away_team == s){
                game.push(
                   gam
    
                )
            }
        })
    
        return game;
    }
    
    async function createWidget(items) {
        let index;
       
        let now = Date.now();
        let closer = items[0].start_date ;
        items.map((it) => {
            let tmp = new Date(it.start_date)
            if( it.home_points ){
                closer = tmp;
                index = it;
            }

            if( index == undefined){
                index = items[items.length - 5]
            }
        })
        let item = index

        const imageSize = 26
        let widgetcolor = await getTeamColor(item.home_team);
        let w = new ListWidget()
         w.backgroundColor = new Color("#FFFFFF")
    //     w.centerAlignContent()
        let logoaway  = await getTeams(item.away_team)
        let reqaway = new Request(logoaway)
        let imgaway = await reqaway.loadImage();
        let logohome  = await getTeams(item.home_team)
        let reqhome = new Request(logohome)
        let imghome = await reqhome.loadImage();
        // w.addText(item.away_team)
        // w.addImage(imgaway)
        // if(item.away_points){
        //   w.addText(item.away_points + "")
        // }
        // w.addText(item.home_team)
        // w.addImage(imghome)
        // if(item.home_points){
        //   w.addText(item.home_points + "")
        // }
        


        let rowStack = w.addStack()
    //rowStack.centerAlignContent()

    // home team image
    let homeImageStack = rowStack.addStack();
    let homeImage = homeImageStack.addImage(imgaway);
    homeImage.imageSize = new Size(imageSize, imageSize)
//     homeImageStack.addSpacer(10)

    // home team name
    let homeNameStack = rowStack.addStack();
//     homeNameStack.layoutVertically()
    let homeName = homeNameStack.addText(item.away_team);
    homeName.font = Font.mediumSystemFont(12);
//     homeNameStack.size = new Size(100, 14)
    homeNameStack.addText(" "+item.away_points )
//     homeNameStack.addSpacer()

    // home team score 
    //let homeScoreStack = rowStack.addStack();
    //let homeScore = homeScoreStack.addText(item.away_score+"");
    

    let separatorStack = rowStack.addStack();
//     separatorStack.centerAlignContent()
    let separator = separatorStack.addText('')
    separator.font = Font.mediumSystemFont(12)
//     separatorStack.size = new Size(24, 12)// 
// separatorStack.addSpacer(10)

    // away team name
    let awayNameStack = rowStack.addStack();
    awayNameStack.addSpacer()// 
// awayNameStack.layoutVertically()
awayNameStack.addText(item.home_points+" ")
    let awayName = awayNameStack.addText(item.home_team);
    awayName.font = Font.mediumSystemFont(12);
//     awayNameStack.size = new Size(100, 14)// 
// awayNameStack.addText(item.home_points+"")
//     awayNameStack.addSpacer(10)

    // away team image
    let awayImageStack = rowStack.addStack();
    let awayImage = awayImageStack.addImage(imghome);
    awayImage.imageSize = new Size(imageSize, imageSize);

//     w.addSpacer(5)

    let infoRowStack = w.addStack()
    infoRowStack.centerAlignContent()
    infoRowStack.addSpacer()

    let dateStack = infoRowStack.addStack()
    const dateFormatter = new DateFormatter()
    dateFormatter.useMediumDateStyle()
    dateFormatter.useShortTimeStyle()
    let parsedDate = new Date(Date.parse(item.start_date))
    let formattedDate = dateFormatter.string(parsedDate)

    let date = dateStack.addText(formattedDate)
    date.font = Font.mediumSystemFont(10)
    date.textOpacity = 0.5

    dateStack.addSpacer(10)
    infoRowStack.addSpacer()
    
        
        return w;
      }
      let thisteam = args.widgetParameter
      thisteam = thisteam == null? "Western Kentucky" : thisteam
    
      let items = await getGames(thisteam)
    
    if (config.runsInWidget) {
      let widget = await createWidget(items)
      Script.setWidget(widget)
      Script.complete()
    } else {
      let item = items[items.length -1]
    //   Safari.open(item.url)
    }
