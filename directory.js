function directory() {
  // first load the list of UK nations from nationstates (api request)
  //var nationtext;
  //$.get("https://www.nationstates.net/cgi-bin/api.cgi?region=united_kingdom&q=numnations",function(data){nationtext = data});
  listOfNations = ["akillianuk","ostmount"]
  //parser = new DOMParser();
  //xmlDoc = parser.parseFromString(nationtext,"text/xml");
  //listOfNations = xmlDoc.getElementsByTagName("NATIONS")[0].innerHTML.split(":");
  // then we are going to try to remain in the same session and grab the data we need for every user in every group
  // the constituent nation is defined as the users main nation

  var groups = [56, 57, 58, 59];
  var groupText = {56:"Scotland",57:"Wales",58:"England",59:"NorthernIreland"};
  var users = [];
  var cnations = {"England":0, "Scotland":0, "Wales":0, "Northern Ireland":0};
  var post = "";
  for(var i = 0; i < groups.length; i++) {
    var Http = new XMLHttpRequest();
    var gurl = "https://nsuk.proboards.com/members?group="+groups[i]+"&view=group";
    var theText;
    Http.open("GET", gurl);
    Http.send();
    Http.onreadystatechange = (e) => {theText = Http.responseText};
    setTimeout(function(){ 
    gdata = /\['proboards.user',(\{.*\})\]/.exec(theText)[1];
    jdata = JSON.parse(gdata);
    for(var u in jdata) {
      var uname = jdata[u].name;
      if(!listUsers.includes(uname)) {
      listUsers.push(uname);
      var uurl = jdata[u].url;
      var uText;
      var Http1 = new XMLHttpRequest();
      Http1.open("GET", uurl);
      Http1.send();
      Http1.onreadystatechange = (e) => {uText = Http.responseText};
      setTimeout(function(){ 
      discord = /Discord Handle:\s*<\/td>\s*<td>\s*([A-z0-9]+#[0-9]+)/.exec(uText)[1];
      mainnation = /Main Nation:\s*<\/td>\s*<td>\s*(England|Scotland|Wales|Northern Ireland)/.exec(uText)[1];
      if(mainnation){cnations[mainnation] += 1;} else {cnations[groupText[groups[i]]] += 1;};
      nsnation = /Nation in NSUK:\s*<\/td>\s*<td>\s*(\w.*)/.exec(uText)[1].replace(" ","_").toLowerCase();
      s = "[b]Name:[/b] " + uname + "\n";
      if(nsnation) {s += "[b]NS Nation in UK:[/b] [a href='https://nationstates.net/" + nsnation + "']" + nsnation + "\n"} else {s += s += "[b]NS Nation in UK:[/b] N/A\n"};
      if(discord) {s += "[b]Discord:[/b] " + discord + "\n"} else {s += "[b]Discord:[/b] N/A\n"};
      if(mainnation) {s += "[b]Constituent Nation:[/b] " + mainnation + "\n"} else {s += "[b]Constituent Nation:[/b] N/A\n"};
      if(nsnation in listOfNations) {s += "[b][font color='green']Verified[/color][/b]"} else {s += "[b][font color='red']Nation CTE[/color][/b]"};
      post += s + "\n";}, 1500);
      } else {continue}
    }
  } , 1500);
  sums = cnations["England"] + cnations["Scotland"] + cnations["Wales"] + cnations["NorthernIreland"];
  totals = '[hr][hr][div style="text-align:center;"][b][font size="5"]United Kingdom Citizenship Directory[/font][/b][/div][hr style="text-align:center;"][hr][font size="4"][div style="text-align:center;"]current forums population:'+sums+'[/div][/font][hr][hr][div align="center"][table][tbody][tr][td style="padding:3px;"][font color="d80000" size="5"]England[/font][/td][td style="padding:3px;"][font color="373e8a" size="5"]Scotland[/font][/td][td style="padding:3px;"][font size="5" color="a8a800"]Wales[/font][/td][td style="padding:3px;"][font color="25791a" size="5"]Northern Ireland[/font][/td][/tr][tr][td style="padding:3px;"][div align="center"][font size="7"][b]'+cnations["England"]+'[/b][/font][/div][/td][td style="padding:3px;"][div align="center"][font size="7"][b]'+cnations["Scotland"]+'[/b][/font][/div][/td][td style="padding:3px;"][div align="center"][font size="7"][b]'+cnations["Wales"]+'[/b][/font][/div][/td][td style="padding:3px;"][div align="center"][font size="7"][b]'+cnations["Northern Ireland"]+'[/b][/font][/div][/td][/tr][/tbody][/table][/div]\n\n'
  console.log(totals + post);
}
