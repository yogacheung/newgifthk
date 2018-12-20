// settings loaded from xml file
function XMLSettings()
{
    this.xmlDoc = undefined;    // text from xml
    this.filePath = undefined;  // file to load
    this.callbackFn = undefined;    // callback function to start when loading will compelte
    this.letter = undefined;    // store config for letter
    this.font = undefined;    // store config for font

    // return true if xml data was loaded, false otherwice
    this.isLoaded = function()
    {
        return this.xmlDoc !== undefined;
    }

    // start load 
    this.startLoad = function(filePath, callbackFn)
    {
        this.filePath = filePath;
        this.callbackFn = callbackFn;

        var xhttp = new XMLHttpRequest();

        // this not work on ie10, ie9 "add AddType application/xml .xml" to .htaccess file 
        if(xhttp.overrideMimeType!== undefined)
            xhttp.overrideMimeType('text/xml'); 

        xhttp.open("GET", this.filePath, true);
        xhttp.send(null);
        var th = this; // this in callabck funciton
        xhttp.onreadystatechange = function()
        {
            if (xhttp.status == "200" && xhttp.readyState == 4)
            {
                th.xmlDoc = xhttp.responseXML; 
                if(th.callbackFn !== undefined)
                    th.callbackFn(th); // call callback and pass this to it
            }
        }       
    }

    // list of get functions 
    // get data by name from xml
    this.getData= function(name)
    {
        if(!this.isLoaded())
            return undefined;
        
        var itemsArray = this.xmlDoc.getElementsByTagName(name);
        var node = itemsArray[0].childNodes[0];
        return node.textContent === undefined ? node.text : node.textContent; // ie9 fix
    }
    
    // Init config 
    this.initConfig = function()
    {
        if(this.isLoaded() === false)
        {
            console.log("Error: config not loaded yet, call startLoad");
            return;
        }
        
        // init config records
        this.letter = this.getConfigFor("letter");
        this.font = this.getConfigFor("font");

        // test:
        //console.log("principal " + this.letter.principal);
        //console.log("font size: " + this.font.principal.size);
    }

    // return font configuration
    this.getConfigFor = function(root)
    {
        var rootObj = new Object();
        var elements = this.xmlDoc.getElementsByTagName(root);
        var rootSection = elements[0];

        this._readForRoot(rootSection, rootObj);

        return rootObj;
    }
    
    // recursive function
    this._readForRoot = function(rootSection, store)
    {
        for (var i = 0; i < rootSection.childNodes.length; i++)
        {
            var node = rootSection.childNodes[i];
            //if (node.nodeTypeString == "element")
            if (node.nodeType == 1)
            {
                var nodeName = node.nodeName;
                if(node.childNodes.length == 1)
                {
                    store[nodeName] = (node.textContent !== undefined ? node.textContent : node.text); // IE 9 fix
                }
                else
                {
                    store[nodeName] = new Object();
                    this._readForRoot(node, store[nodeName]);
                }
            }
        }
    }


    // return font configuration
    //this.getConfigFor = function(root)
    //{
        //var rootObj = new Object();
        //var elements = this.xmlDoc.getElementsByTagName(root);
        //var rootSection = elements[0].children; 
        //for(var r = 0; r < rootSection.length; r++)
        //{
            //var name = rootSection[r].nodeName;
            //var children = rootSection[r].children;
            //if(children.length != 0)
            //{
                //rootObj[name] = new Object(); 
                //// FIXME: it can be recurvice
                //for(c = 0; c < children.length; c++)
                //{
                    //var childrenName = children[c].nodeName;
                    //var childrenValue = children[c].innerHTML;
                    //rootObj[name][childrenName] = childrenValue;

                    ////console.log("   '"+childrenName+"'='"+childrenValue+"'");
                //}
            //}
            //else
            //{
                //// no children, just add as text
                //rootObj[name] = rootSection[r].innerHTML;
            //}
        //}
        
        //return rootObj;
    //}


}
