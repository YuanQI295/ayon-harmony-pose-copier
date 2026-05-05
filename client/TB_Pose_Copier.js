function PoseCopierDialog()
{
  PoseCopierUI.dialog = {}; 
  function trace( msg )
  {
    MessageLog.trace( "Pose Copier : " + msg );
  }

  this.setControlsAvailability = function ()
  {

    if (this.nbSliders == 3)
    {
      this.ui.horizontalSlider.enabled = true;
      this.ui.verticalSlider.enabled = true;
      this.ui.horizontalSlider_2.enabled = true;
      this.ui.verticalEdit.enabled = true;
      this.ui.horizontalEdit.enabled = true;
      this.ui.horizontal2Edit.enabled = true;
      this.ui.verticalEdit.text = this.nameCacheY[this.sliderY];
      this.ui.horizontal2Edit.text = this.nameCacheZ[this.sliderZ];
    }
    else if (this.nbSliders == 2)
    {
      this.ui.horizontalSlider.enabled = true;
      this.ui.verticalSlider.enabled = true;
      this.ui.horizontalSlider_2.enabled = false;
      this.ui.verticalEdit.enabled = true;
      this.ui.horizontalEdit.enabled = true;
      this.ui.horizontal2Edit.enabled = false;
      this.ui.verticalEdit.text = this.nameCacheY[this.sliderY];
      this.ui.horizontal2Edit.text = " ";
    }
    else if (this.nbSliders == 1)
    {
      this.ui.horizontalSlider.enabled = true;
      this.ui.verticalSlider.enabled = false;
      this.ui.horizontalSlider_2.enabled = false;
      this.ui.verticalEdit.enabled = false;
      this.ui.horizontalEdit.enabled = true;
      this.ui.horizontal2Edit.enabled = false;
      this.ui.verticalEdit.text = " ";
      this.ui.horizontal2Edit.text = " ";
    }
    else
    {
      this.ui.horizontalSlider.enabled = true;
      this.ui.verticalSlider.enabled = false;
      this.ui.horizontalSlider_2.enabled = false;
      this.ui.verticalEdit.enabled = false;
      this.ui.horizontalEdit.enabled = false;
      this.ui.horizontal2Edit.enabled = false;
      this.ui.verticalEdit.text = " ";
      this.ui.horizontal2Edit.text = " ";
    }

    this.ui.frameEdit.enabled = true;

    this.ui.horizontalEdit.text = this.nameCacheX[this.sliderX];

    this.ui.pairingCB.enabled = true;
    this.ui.pasteByNameCB.enabled = true;
    this.ui.pasteLocalValuesCB.enabled = true;

    if (this.ui.pairingCB.checked)
    {
      this.ui.pairingButton.enabled = true;
      this.ui.findButton.enabled = true;
      this.ui.node.text = this.getNode().substr(4);
      this.ui.node.toolTip = this.getNode();
    }
    else
    {
      this.ui.pairingButton.enabled = false;
      this.ui.findButton.enabled = false;
      this.ui.node.text = "";
      this.ui.node.toolTip = "";
    }


    this.ui.useExcludedModulesCB.enabled = true;

    if (this.ui.useExcludedModulesCB.checked)
    {
      this.ui.excludeButton.enabled = true;
    }
    else
    {
      this.ui.excludeButton.enabled = false;
    }

  }


  this.update = function ()
  {
    if (this.template == null)
    {
      this.updating = true;
      this.ui.horizontalSlider.enabled = false;
      this.ui.verticalSlider.enabled = false;
      this.ui.horizontalSlider_2.enabled = false;
      this.ui.pairingButton.enabled = false;
      this.ui.pairingCB.enabled = false;
      this.ui.excludeButton.enabled = false;
      this.ui.useExcludedModulesCB.enabled = false;
      this.ui.findButton.enabled = false;
      this.ui.verticalEdit.enabled = false;
      this.ui.horizontalEdit.enabled = false;
      this.ui.horizontal2Edit.enabled = false;
      this.ui.frameEdit.enabled = false;
      this.ui.verticalEdit.text = "";
      this.ui.horizontalEdit.text = "";
      this.ui.horizontal2Edit.text = "";
      this.ui.frameEdit.text = "";
      this.ui.node.text = "";
      this.ui.thumbnail.text = translator.tr("No pixmap");
      this.ui.thumbnail.pixmap = null; ;
      this.frame = 0;
      this.updating = false;
    }
    else
    {
      this.updating = true;
      this.setControlsAvailability();
      this.ui.horizontalSlider.value = this.sliderX;
      this.ui.verticalSlider.value = this.sliderY;
      this.ui.horizontalSlider_2.value = this.sliderZ;
      this.updating = false;

      var folder = this.template + "/.thumbnails";

      var frame
      if (this.nbSliders == 0)
        frame = this.sliderX;
      else
        frame = this.findFrame(this.sliderX, this.sliderY, this.sliderZ);

      // System.println("frame finding: " + this.sliderX + "  " + this.sliderY + " " + this.sliderZ + " " + frame);
      if (frame > 0)
      {
        var frameString = frame.toString();
        while (frameString.length < 4)
        {
          frameString = "0" + frameString;
        }

        var filename = "t-" + frameString + ".png";
        var filepath = folder + "/" + filename;

        var pix = new QPixmap;
        if (pix.load(filepath))
        {
          this.ui.thumbnail.pixmap = pix;
          this.ui.thumbnail.text = null;
        }
        else
        {
          this.ui.thumbnail.text = translator.tr("No pixmap");
          this.ui.thumbnail.pixmap = null; ;
        }
        this.ui.frameEdit.text = frame;
        this.frame = frame;
      }
      else
      {
        this.ui.thumbnail.text = translator.tr("No frame");
        this.ui.thumbnail.pixmap = null; ;
        this.ui.frameEdit.text = translator.tr("<no frame>");
        this.frame = 0;
      }
    }
  }


  // callback when slider are changed
  this.horizontalSliderChanged = function (value)
  {
    // MessageBox.information( "slider H ");
    if (this.updating == false)
    {
      this.sliderX = value;
      // System.println("updateing slider X " + value);
      this.update();
    }
  }


  this.verticalSliderChanged = function (value)
  {
    // MessageBox.information( "slider V ");
    if (this.updating == false)
    {
      this.sliderY = value;
      // System.println("updateing slider Y " + value);
      this.update();
    }
  }


  this.horizontalSlider2Changed = function (value)
  {
    // MessageBox.information( "slider H 2" );
    if (this.updating == false)
    {
      this.sliderZ = value;
      // System.println("updating slider Z" + value);
      this.update();
    }
  }


  // Define whether or not we are using the default node
  this.pairingCheckBoxStateChanged = function (value)
  {
    if (value == 2)
    {
      this.ui.pairingButton.enabled = true;
      this.ui.node.show();
      this.ui.findButton.enabled = true;
    }
    else
    {
      this.ui.pairingButton.enabled = false;
      this.ui.node.text = "";
      this.ui.findButton.enabled = false;
    }

    this.update();
  }


  // Use the current selected node as the default one for the current template. Write a file in the template
  this.pairingButtonPressed = function ()
  {
    var filename = this.template + "/link_module_with_template";
    var file = new File(filename);

    var nodeName = selection.selectedNode(0);

    try
    {
      file.open(2 /*FileAcess.WriteOnly*/
                );
      file.write(nodeName);
      file.close();

      this.update();

      return true;
    }
    catch (err)
    {
      return false;
    }
  }


  // The current selection will change for the default selected node, it'll help users find which module they are linking with
  this.findButtonPressed = function ()
  {
    nodeName = this.getNode();
    selection.clearSelection();
    selection.addNodeToSelection(nodeName);
  }


  this.mainCloseButtonPressed = function ()
  {
    this.ui.close();
    this.savePref();
  }


  this.applyButtonPressed = function ()
  {
    // System.println("applyButtonPressed");
    this.pasteSingleFrameFromTemplate(this.frame);
  }


  // Open a list that shows item that are currently setted as exclude from a paste in a selected destination
  this.openList = function (value)
  {
    var a = this.getExcludedNodeList("All")

    if (a != null)
    {
      var checkStatus = this.getCheckedStatus();
      var iter = 0;
      if (checkStatus == null)
      {
        checkStatus = [];
        for (var fill in a)
        {
          checkStatus.push(true);
          for (var i in a[fill])
          {
            checkStatus.push(true);
          }
        }
      }

      for (var name in a)
      {
        var items = this.listWindow.treeWidget.findItems(name.trim(), Qt.MatchExactly);
        var item;
        if ( items.length == 0 )
        {
          item = new QTreeWidgetItem();
          item.setText(0, name);
          var disableChildren = false;
          if (checkStatus[iter])
            item.setCheckState(0, Qt.Checked);
          else
          {
            item.setCheckState(0, Qt.Unchecked);
            disableChildren = true;
          }
          iter++;
        }
        else
        {
          item = items[0];
        }

        var children = item.takeChildren();
        var count = 0;
        for (var idx = 0; idx < a[name].length; idx++)
        {
          var isAlreadyAChild = false;
          var childName = a[name][idx].substr(4).trim();
          for (var pos = 0; pos < children.length; pos++)
          {
            if ( childName == children[pos].text(0) )
              isAlreadyAChild = true;
          }

          if ( isAlreadyAChild == false )
          {
            var child = new QTreeWidgetItem();
            child.setText(0, childName);
            if (checkStatus[iter])
              child.setCheckState(0, Qt.Checked);
            else
              child.setCheckState(0, Qt.Unchecked);
            iter++;

            child.setDisabled(disableChildren);
            item.addChild(child);
          }
          else
          {
            item.addChild(children[count]);
            count++;
          }
          isAlreadyAChild = true;
        }
        this.listWindow.treeWidget.addTopLevelItem(item);
        this.listWindow.treeWidget.itemChanged.connect(item, this.setVisibility);
      }
    }

    this.listWindow.show();
  }


  // Write and update the list of excluded node
  this.updateListButtonPressed = function ()
  {
    var isAdding = this.updateExcludedNodeFile("add");
    if ( isAdding )
    {
      this.listWindow.hide();
      this.openList();
    }
  }


  // Remove a list of items and update the tree widget
  this.removeItemInListButtonPressed = function ()
  {
    var selectedItems = this.listWindow.treeWidget.selectedItems();
    for ( var idx = 0; idx < selectedItems.length; idx++ )
    {
      var parent = selectedItems[idx].parent();
      if ( parent != null )
      {
        this.updateExcludedNodeFile("remove", selectedItems[idx]);
        parent.removeChild( selectedItems[idx] );
      }
      else
      {
        this.updateExcludedNodeFile("remove", selectedItems[idx]);
        var index = this.listWindow.treeWidget.indexOfTopLevelItem( selectedItems[idx] );
        delete this.listWindow.treeWidget.takeTopLevelItem( index );
      }
    }
  }


  // First choice : the list will be updated with less value. So, value == remove and there will be one less excluded module in the list
  // Second choice : the list will be updated with more values. So, value == add and there can be more than one excluded module added in the list (all module tag are timeline tag). Already in the list = ignored
  this.updateExcludedNodeFile = function (value, child)
  {
    var filename = this.template + "/pose_copier_excludedLayerList.json";
    var s = "";

    if (value == "remove")
    {
      var a = readJSON(filename);
      var jsondocument = {};

      if ( a != null )
        jsondocument = a;

      var parent = child.parent();
      if ( parent != null )
      {
        var index = -1;

        for (var i = 0; i < jsondocument[parent.text(0)].length; i++) {
          if (jsondocument[parent.text(0)][i].substr(4) == child.text(0))
          {
            index = i;
          }
        }

        jsondocument[parent.text(0)].splice(index, 1);
      }
      else
      {
        delete jsondocument[child.text(0)];
      }

      writeJSON(jsondocument, filename);
    }
    else if (value == "add")
    {
      var a = [];
      var b = {};

      var list = node.getTimelineTagList();

      if ( list.empty )
        return false;

      var a = readJSON(filename);
      var jsondocument = {};

      if ( a != null )
        jsondocument = a;

      for (var idx = 0; idx < list.length; idx++)
      {
        var child = list[idx];
        jsondocument[this.listWindow.treeWidget.currentItem().text(0)][idx] = list[idx];
      }

      return writeJSON(jsondocument, filename);
    }
  }


  // Save local preferences
  this.savePref = function ()
  {
    preferences.setBool("POSE_COPIER_PASTE_BY_NAME", this.ui.pasteByNameCB.checked);
    preferences.setBool("POSE_COPIER_PASTE_LOCAL_VALUES", this.ui.pasteLocalValuesCB.checked);
    preferences.setBool("PASTE_IS_LOCKED_TO_AN_ELEMENT", this.ui.pairingCB.checked);
    preferences.setBool("POSE_COPIER_FILL_NEXT_KEY_EXPOSURE", this.ui.drawingSubstitutionCB.checked);
    preferences.setBool("USE_OF_EXCLUDED_MODULES_LIST", this.ui.useExcludedModulesCB.checked);
    preferences.setInt("CURRENT_WIDTH_OF_THE_POSE_COPIER_DIALOG", this.ui.width);
    preferences.setInt("CURRENT_HEIGHT_OF_THE_POSE_COPIER_DIALOG", this.ui.height);
    preferences.setInt("CURRENT_X_POS_OF_THE_POSE_COPIER_DIALOG", this.ui.x);
    preferences.setInt("CURRENT_Y_POS_OF_THE_POSE_COPIER_DIALOG", this.ui.y);
  }


  this.sortNumericSuffixFunctor = function (a, b)
  {
    var re = /^\d*/;
    a = a.trim();
    b = b.trim();
    var av = parseInt(a.match(re));
    var bv = parseInt(b.match(re));
    if (av < bv)
      return -1;
    if (av == bv)
    {
      if (a < b)
        return -1;
      if (a == b)
        return 0;
    }
    return 1;
  }


  // return the annotation column from the selected template.
  function readJSON(filename)
  {
    var file = new File(filename);

    try
    {
      if (file.exists)
      {
        file.open(1 /* FileAccess.ReadOnly */
                  );
        var string = file.read();
        file.close();
        return JSON.parse(string);
      }
    }
    catch (err)
    {}
    return null;
  }


  // read an XML file.
  function readXmlFile(filename)
  {
    var file = new File(filename);

    try
    {
      if (file.exists)
      {
        file.open(1 /* FileAccess.ReadOnly */
                  );
        var string = file.read();
        file.close();
        var xmlDom = new QDomDocument();
        xmlDom.setContent(string);

        return xmlDom;
      }
    }
    catch (err)
    {}
    return null;

  }


  function writeJSON( document, filename  )
  {
    var file = new File( filename );

    try
    {
      file.open( 2 /* FileAccess.WriteOnly */ );
      file.write( JSON.stringify( document ) );
      file.close();

      return true;
    }
    catch(err)
    {
      // .... what to do.
      return false;
    }
  }


  function findAndConvertColumn(columns, columnName)
  {
    var a = [];

    var column = null;
    for (var idx = 0; idx < columns.count(); idx++)
    {
      if (columns.at(idx).toElement().attribute("name") == columnName)
      {
        column = columns.at(idx).toElement();
        break;
      }
    }

    if (column)
    {
      // parse the timing info.
      var elementSeqs = column.elementsByTagName("elementSeq");
      for (idx = 0; idx < elementSeqs.count(); ++idx)
      {
        var seq = elementSeqs.at(idx).toElement();
        var exposures = seq.attribute("exposures");
        var timing = seq.attribute("val");
        while (exposures)
        {
          var currentExposure;
          var comma = exposures.search(",")
          if (comma > 0)
          {
            currentExposure = exposures.substr(0, comma)
            exposures = exposures.substr(comma + 1);
          }
          else
          {
            currentExposure = exposures;
            exposures = null;
          }

          var p = currentExposure.search("-");
          if (p > 0)
          {
            var startFrame = parseInt(currentExposure.substr(0, p));
            var endFrame = parseInt(currentExposure.substr(p + 1)) + 1;
            for (; startFrame < endFrame; ++startFrame)
            {
              a[startFrame] = timing;
            }
          }
          else if (p < 0)
          {
            a[parseInt(currentExposure)] = timing;
          }
          else
          {
            // p == 0 ---- sequence starts with hyphen --- huh!!
          }
        }
      }
    }

    return a;
  }


  /* get the annotation from the cache filed, or produce it and return
   an Array of object, where for each object you have the frame and a string content at that frame.
   */
  function getCacheFile( bForceReload, forcedTemplatePath)
  {

    if( typeof bForceReload === "undefined" )
      bForceReload = false;

    $.log("=== getCacheFile() params ===");
    $.log("bForceReload: " + bForceReload);
    $.log("forcedTemplatePath: " + forcedTemplatePath);
    
    var template;
    if (forcedTemplatePath) {
      template = fileMapper.toNativePath(forcedTemplatePath);
    } else {
        if (library.numberOfTemplatesSelected() != 1)
            return;
        template = fileMapper.toNativePath(library.getSelectedTemplate(0));
    }

    var stageFilename = template + "/scene.xstage";
    var cacheFilename = template + "/pose_copier_cached_data.json";

    var stageFile = new File(stageFilename);
    var cacheFile = new File(cacheFilename);

    var a = null; // returned collection.
    var maxNbFrames = 0;

    /* load cache annotation from cache file to avoid re-reading the main stage file */
    if (bForceReload == false  && cacheFile.exists && stageFile.exists)
    {
      if (cacheFile.lastModified.getTime() > stageFile.lastModified.getTime())
      {
        a = readJSON(cacheFilename);
      }
    }

    /* no annotation cache, read the whole Stage file and generate the cache info */
    if (a == null)
    {
      trace( "Building cache for " + stageFilename + "...");
      a = {};
      var stageDom = readXmlFile(stageFilename);
      var hasGuide = false;
      if (stageDom)
      {
        var modules = stageDom.elementsByTagName("module");
        var columns = stageDom.elementsByTagName("column");
        for (var idx = 0; idx < modules.count(); idx++)
        {
          var module = modules.at(idx).toElement();
          if (module.attribute("type") == "READ")
          {
            var name = module.attribute("name");
            var strippedName = name.substr(0,4).toLowerCase();
            var elements = module.elementsByTagName("element");
            if (elements.count())
            {
              var columnName = elements.at(0).toElement().attribute("col");
              var c = findAndConvertColumn(columns, columnName);
              if( c.length > 0 && ( strippedName == "slh-" || strippedName == "slv-"  || strippedName == "slx-" ) )
              {
                hasGuide = true;
                a[name] = c;
              }
              else
              {
                var nbFrames = c.length;
                if (nbFrames > maxNbFrames)
                  maxNbFrames = nbFrames;
              }
            }
          }
        }
        trace( "Building cache completed." );
        if (!hasGuide)
        {
          trace( "Template does not have any slider definition. A single slider will allow to select any of the frames in the template." );
          a[0] = maxNbFrames;
        }
        writeJSON(a, cacheFilename);
      }
    }

    //debug
    // trace( JSON.stringify(a) );
    return a;
  }


  // Load and build template
  this.loadCache = function ( bForceReload, forcedTemplatePath )
  {
    $.log("=== loadCache() params ===");
    $.log("bForceReload: " + bForceReload);
    $.log("forcedTemplatePath: " + forcedTemplatePath);
    var a = getCacheFile(bForceReload, forcedTemplatePath); // get the cache file from selected template.f
    this.nbSliders = 0;
    this.cache = a;

    var framesX = null;
    var framesY = null;
    var framesZ = null;

    /*Used when there's no guide*/
    var maxFramesNumber = 0;

    for (var name in a)
    {
      var n = name.toLowerCase().substr(0, 4)
      if (n == "slv-" || n == "slh-" || n == "slx-")
      {
        if (n == "slv-")
        {
          framesY = a[name];
        }
        else if (n == "slh-")
        {
          framesX = a[name];
        }
        else if (n == "slx-")
        {
          framesZ = a[name];
        }
        this.nbSliders = this.nbSliders + 1;
      }
      else // we need to know the max frame number
      {
        var maxFramesNumber = a[0];
      }
    }

    var xc = {}; // 3d Array, sorted by major X
    var yc = {}; // 2d array with Y axis names.
    var zc = {}; // 2d array with Z axis names.

    if (framesX != null)
    {
      var maxFrames = framesX.length;
      if (framesY != null && framesY.length > maxFrames)
        maxFrames = framesY.length;
      if (framesZ != null && framesZ.length > maxFrames)
        maxFrames = framesZ.length;
      for (var frame = 1; frame < maxFrames; frame++)
      {
        var vx = framesX[frame];
        var vy;
        var vz;

        if (xc[vx] == null)
        {
          xc[vx] = {};
        }

        if (this.nbSliders == 3)
        {
          vy = framesY[frame];
          vz = framesZ[frame];

          if (xc[vx][vy] == null)
          {
            xc[vx][vy] = {};
          }

          xc[vx][vy][vz] = frame;

        }
        else if (this.nbSliders == 2)
        {
          vy = framesY[frame];
          xc[vx][vy] = frame;
        }
        else
        {
          xc[vx] = frame;
        }
        yc[vy] = 1; // just record the name of that property.
        zc[vz] = 1;

      }
    }
    var xNameArray = [];
    var yNameArray = [];
    var zNameArray = [];
    var name;
    for (name in xc)
    {
      if (name != null && name != undefined)
      {
        // System.println("XXX: " + name);
        xNameArray.push(name);
      }
    }
    for (name in yc)
    {
      if (name != null && name != undefined)
      {
        // System.println("YYY: " + name);
        yNameArray.push(name);
      }
    }
    for (name in zc)
    {
      if (name != null && name != undefined)
      {
        // System.println("ZZZ: " + name);
        zNameArray.push(name);
      }
    }
    xNameArray.sort(this.sortNumericSuffixFunctor);
    yNameArray.sort(this.sortNumericSuffixFunctor);
    zNameArray.sort(this.sortNumericSuffixFunctor);

    this.cacheXYZ = xc;
    this.nameCacheX = xNameArray;
    this.nameCacheY = yNameArray;
    this.nameCacheZ = zNameArray;

    this.updating = true;

    if (framesX != null)
    {
      this.sliderX = Math.floor(xNameArray.length / 2);
      this.ui.horizontalSlider.minimum = 0;
      this.ui.horizontalSlider.maximum = xNameArray.length - 1;
      this.ui.horizontalSlider.value = this.sliderX;
    }
    else
    {
      this.sliderX = Math.floor(maxFramesNumber / 2);
      this.ui.horizontalSlider.minimum = 1;
      this.ui.horizontalSlider.maximum = maxFramesNumber - 1;
      this.ui.horizontalSlider.value = this.sliderX;
    }

    this.sliderY = Math.floor(yNameArray.length / 2);
    this.sliderZ = Math.floor(zNameArray.length / 2);

    this.ui.verticalSlider.minimum = 0
    this.ui.verticalSlider.maximum = yNameArray.length - 1;
    this.ui.verticalSlider.value = this.sliderY;

    this.ui.horizontalSlider_2.minimum = 0;
    this.ui.horizontalSlider_2.maximum = zNameArray.length - 1;
    this.ui.horizontalSlider_2.value = this.sliderZ;

    this.updating = true;

  }


  // Return the good frame value
  this.findFrameInner = function (x, y, z)
  {
    var nx = this.nameCacheX[x];
    if( typeof nx === "undefined" )
      return null;
    var ny = this.nameCacheY[y];
    if( typeof ny === "undefined" && this.nbSliders > 1 )
      return null;
    var nz = this.nameCacheZ[z];
    if( typeof nz === "undefined" && this.nbSliders > 2 )
      return null;

    if (this.nbSliders == 3)
    {
      var az = this.cacheXYZ[nx][ny];
      if (az != null)
      {
        return az[nz]
      }
    }
    else if (this.nbSliders == 2)
    {
      var ay = this.cacheXYZ[nx];
      if (ay != null)
      {
        return ay[ny]
      }
    }
    else if (this.nbSliders == 1)
    {
      return this.cacheXYZ[nx];
    }
    return null;
  }


  // find frame of the src template depending of the current sliders value. Minimization algorythm
  this.findFrame = function (x, y, z)
  {
    if (this.cacheXYZ == null || this.nameCacheX == null || this.nameCacheY == null || this.nameCacheZ == null)
      return 1; // return default first frame of template

    // minimize distance.
    var distance;
    var cx;
    var cy;
    var cz;
    var frame;

    frame = this.findFrameInner(x, y, z);
    if (frame)
      return frame;

    for (distance = 1; distance < 4; distance++)
    {
      for (cx = x - distance; cx <= x + distance; cx++)
      {
        frame = this.findFrameInner(cx, y - distance);
        if (frame)
          return frame;
        frame = this.findFrameInner(cx, y + distance);
        if (frame)
          return frame;
      }
      for (cy = y - distance; cy <= y + distance; cy++)
      {
        frame = this.findFrameInner(x - distance, cy);
        if (frame)
          return frame;
        frame = this.findFrameInner(x + distance, cy);
        if (frame)
          return frame;
      }
    }
    return 0;
  }


  /*Return the node we want to paste in*/
  this.getNode = function ()
  {
    
    var filename = this.template + "/link_module_with_template";

    $.log ("filename:" + filename);
    
    var file = new File(filename);

    var string = "";

    if (this.ui.pairingCB.checked == false && selection.numberOfNodesSelected() > 0)
    {
      return selection.selectedNode(0);
    }
    else if (this.ui.pairingCB.checked == true && file.exists)
    {
      try
      {
        file.open(1 /* FileAccess.ReadOnly */
                  );
        var string = file.read();
        file.close();

      }
      catch (err)
      {}
    }
    return string;
  }


  // Returns the list of the current excluded node. It will only return the modules that are child of the current selected destination module
  this.getExcludedNodeList = function ( value )
  {
    var filename = this.template + "/pose_copier_excludedLayerList.json";
    var file = new File(filename);

    var nodeName = this.getNode();
    var parentNameLength = nodeName.length;

    var finalList = new Array;

    if ( this.ui.useExcludedModulesCB.checked == false )
      return finalList;

    if ( value == "Final" )
    {
      var tempList = readJSON(filename);
      var pos = 0;
      var i = 0;

      for (var name in tempList)
      {
        var items = this.listWindow.treeWidget.topLevelItem(i);

        var item = null;
        if( items.count )
          item = items[0];
        else if (items == "QTreeWidgetItem")
          item = items;

        if ( item == null || item.checkState(0) == Qt.Checked)
        {
          var children = tempList[name];
          for (var idx = 0; idx < children.length; idx++)
          {
            if( item != null )
            {
              var childrenItem = item.child(idx);
              if ( childrenItem.checkState(0) == Qt.Checked)
              {
                finalList[pos] = children[idx];
                pos++;
              }
            }
            else
            {
              finalList[pos] = children[idx];
              pos++;
            }
          }
        }
        i++;
      }
    }
    else if ( value == "All" )
    {
      finalList = readJSON(filename);
    }

    return finalList;
  }


  // Paste a single frame from the template and look for exception within the excluded node list
  this.pasteSingleFrameFromTemplate = function (srcFrame)
  {
    if (this.template == "" && library.numberOfTemplatesSelected() < 1)
    {
      MessageBox.information("Error: No template loaded.");
      return;
    }

    var nodeName = this.getNode();

    if (nodeName == "")
    {
      if (this.ui.pairingCB.checked)
        MessageBox.information("Error: Please set a default destination layer.");
      else
        MessageBox.information("Error: Please select a destination layer.");
      return;
    }

    var templatePath = this.template;

    var currentFrame = frame.current();

    /* Grab the list of excluded modules.*/
    var list = new Array;
    if (this.ui.useExcludedModulesCB.checked)
    {
      this.openList();
      this.listWindow.hide();
      list = this.getExcludedNodeList("Final");
    }

    copyPaste.usePasteSpecial(true);
    copyPaste.setNumFramesSrc(1);
    copyPaste.useCreateTemplateSpecial(false, false, false, false);  // avoid scanning folders for additional files.
    copyPaste.setPasteSpecialForcesKeyFrameAtBegAndEnd(true);
    if( this.drawingSubstitution )
    {
      copyPaste.setPasteSpecialDrawingAutomaticExtendExposure(true,true);
    }
    else
    {
      copyPaste.setPasteSpecialDrawingAutomaticExtendExposure(false,false);
    }

    copyPaste.setPasteSpecialMatchNodeName(this.pasteByName);
    var backupPasteLocalValue = copyPaste.getCurrentPasteOptions().fullTransfer;
    copyPaste.setPasteSpecialFullTransfer(this.pasteLocalValues);


    // make sure that we do not paste any palettes (as requested).
    copyPaste.setPasteSpecialColorPaletteOption( "REUSE_PALETTES" );
    copyPaste.setPasteSpecialColorPaletteOption( "DO_NOTHING" );

    var pasteOptions = copyPaste.getCurrentPasteOptions();
    pasteOptions.startDeleteFrame = srcFrame;
    pasteOptions.actionTemplateMode = false;

    //System.println(currentFrame);
    //System.println(srcFrame);
    //System.println(nodeName);
    //System.println(templatePath);

    var m2 = "Copy & paste of frame " + srcFrame + " from " + templatePath + " to frame " + currentFrame + ".";
    trace( m2 );
    var m = "Pose Copier: " + templatePath + " at " + currentFrame + ".";
    scene.beginUndoRedoAccum( m );

    var excludedDragObjects = new Array();
    for(var i in list)
    {
      var l = new Array;
      l[0] = list[i];
      var excludedDragObject = copyPaste.copy( l, currentFrame, 1, copyPaste.getCurrentCreateOptions() );
      excludedDragObjects[i] = excludedDragObject;
    }


    var dragObject = copyPaste.copyFromTemplate( templatePath, srcFrame, 1, copyPaste.getCurrentCreateOptions() );
    if( dragObject == null )
    {
      scene.cancelUndoRedoAccum();
      MessageBox.error( "Error: Unable to read/parse template." );
    }
    else
    {
      selectedNodes = new Array();
      selectedNodes[0] = nodeName;  // paste over the selected parent group.
      match = copyPaste.paste( dragObject,  selectedNodes, currentFrame, 1, pasteOptions );
      if (match == false)
      {
        scene.cancelUndoRedoAccum();
        MessageBox.information("Error: Structure of destination does not match the structure of the template.");
      }

      for(var i in list)
      {
        var l = new Array;
        l[0] = list[i];
        var excludedDragObject = excludedDragObjects[i];
        if( excludedDragObject )
        {
          match = copyPaste.paste( excludedDragObject, l, currentFrame, 1, pasteOptions );
          if( match == false )
          {
            scene.cancelUndoRedoAccum();
            MessageBox.information("Error: Unable to restore excluded layers.");
            break;
          }
        }
      }
    }

    excludedDragObjects = null;
    copyPaste.setPasteSpecialFullTransfer(backupPasteLocalValue);

    scene.endUndoRedoAccum();
  }


  // Main function. It will update the main dialog depending on the loaded template
  this.open = function ( bForceReload, forcedTemplatePath )
  {
    $.log("=== open() params ===");
    $.log("bForceReload: " + bForceReload);
    $.log("forcedTemplatePath: " + forcedTemplatePath);
    this.sliderX = 0;
    this.sliderY = 0;
    this.sliderZ = 0;
    this.cache = null;
    this.template = null;
    this.thumbnail = null;
    this.updating = false;
    this.flags = null;
    //init with the ui value incase it's enabled from the pref
    this.drawingSubstitution = this.ui.drawingSubstitutionCB.checked;

    this.recreateListWindow();

    if (forcedTemplatePath) {
    this.template = fileMapper.toNativePath(forcedTemplatePath);
    var t = forcedTemplatePath.substr(forcedTemplatePath.lastIndexOf("/") + 1);
    this.ui.label.text = t;
    this.loadCache(bForceReload,forcedTemplatePath);
    this.update();
    return;
    }

    if (library.numberOfTemplatesSelected() > 1)
    {
      this.ui.label.text = translator.tr("Please select only one template.")
    }
    else if (library.numberOfTemplatesSelected() == 0)
    {
      this.ui.label.text = translator.tr("No template currently loaded.");
      this.update();
    }
    else
    {
      this.template = library.getSelectedTemplate(0);
      var t = this.template;
      if (t.lastIndexOf("/") > 0)
        t = t.substr(t.lastIndexOf("/") + 1);
      this.template = fileMapper.toNativePath(this.template);
      this.ui.label.text = t;
      this.loadCache( bForceReload );
      this.update();
    }
  }

  this.recreateListWindow = function()
  {
    // Load list ui and set his widgets signals
    this.listWindow = UiLoader.load(resourcesPath + "/scripts/TB_Pose_Copier_Excluded_Modules_List.ui");
    this.listWindow.updateListButton.released.connect(this, this.updateListButtonPressed);
    this.listWindow.removeItemInListButton.pressed.connect(this, this.removeItemInListButtonPressed);
    this.listWindow.createPresetButton.pressed.connect(this, this.createPresetButtonPressed);
    this.listWindow.okayButton.pressed.connect(this, this.hideListWindow);
    this.listWindow.rejected.connect(this, this.recreateListWindow);
  }

  this.resetCache = function()
  {
    this.open( true );
  }

  this.excludedModulesCheckBoxStateChanged = function (value)
  {
    if ( value == 2 )
    {
      this.update();
    }
    else
    {
      this.listWindow.hide();
      this.update();
    }
  }


  this.drawingSubstitutionCheckBoxStateChanged = function(value)
  {
    this.drawingSubstitution = (value == 2 );
  }


  this.pasteByNameStateChanged = function(value)
  {
    this.pasteByName = (value == 2 );
  }

  this.pasteLocalValuesChanged = function(value)
  {
    this.pasteLocalValues = (value == 2);
  }

  this.hideListWindow = function ()
  {
    this.saveCheckedStatus();
    this.listWindow.hide();
    this.update();
  }

  this.saveCheckedStatus = function()
  {
    var fullList = [];
    for (var i = 0; i < this.listWindow.treeWidget.topLevelItemCount; i++)
    {
      var curItem = this.listWindow.treeWidget.topLevelItem(i);
      fullList.push(curItem.checkState(0) == Qt.Checked);
      for (var j = 0; j < curItem.childCount(); j++)
      {
        var childItem = curItem.child(j);
        fullList.push(childItem.checkState(0) == Qt.Checked);
      }
    }

    var filename = this.template + "/pose_copier_checkedItems.json";
    writeJSON(fullList, filename);
  }

  this.getCheckedStatus = function()
  {
    var filename = this.template + "/pose_copier_checkedItems.json";
    return readJSON(filename);
  }

  this.createPresetButtonPressed = function ()
  {
    var filename = this.template + "/pose_copier_excludedLayerList.json";
    var file = new File(filename);

    var check = this.listWindow.treeWidget.findItems( this.listWindow.presetName.text, Qt.MatchExactly )
    var item = new QTreeWidgetItem();
    if (check.length == 0)
    {
      var itemName = this.listWindow.presetName.text;
      item.setText(0, itemName);
      item.setCheckState(0, Qt.Checked);
      this.listWindow.treeWidget.addTopLevelItem(item);
      this.listWindow.treeWidget.itemChanged.connect(item, this.setVisibility);

      // Add this preset to the list
      var jsondocument = {};
      var a = readJSON(filename);
      if ( a != null )
        jsondocument = a;

      jsondocument[itemName] = [];
      writeJSON(jsondocument, filename);
    }
  }


  this.setVisibility = function (parent, column)
  {
    if ( column != 0 )
      return;

    var checkState = parent.checkState(0);

    var flags = parent.flags();

    for (var idx = 0; idx < parent.childCount(); idx++)
    {
      if ( checkState == Qt.Checked)
      {
        parent.child(idx).setFlags(flags);
      }
      else
      {
        parent.child(idx).setFlags(0 /*Nothing*/);
      }
    }
  }

  var resourcesPath = about.getResourcesPath();

  var addonPath = preferences.getString("AYON_HARMONY_POSECOPIER_UI_DIR","");
  this.ui = UiLoader.load(addonPath)
  CreateTemplatesMenu.call(this);
  this.ui.resetCacheButton.pressed.connect(this, this.resetCache);
  this.ui.horizontalSlider.valueChanged.connect(this, this.horizontalSliderChanged);
  this.ui.verticalSlider.valueChanged.connect(this, this.verticalSliderChanged);
  this.ui.horizontalSlider_2.valueChanged.connect(this, this.horizontalSlider2Changed);
  this.ui.applyButton.released.connect(this, this.applyButtonPressed);
  this.ui.closeButton.pressed.connect(this, this.mainCloseButtonPressed);
  this.ui.pairingButton.pressed.connect(this, this.pairingButtonPressed);
  this.ui.pairingCB.stateChanged.connect(this, this.pairingCheckBoxStateChanged);
  this.ui.excludeButton.pressed.connect(this, this.openList);
  this.ui.useExcludedModulesCB.stateChanged.connect(this, this.excludedModulesCheckBoxStateChanged);
  this.ui.findButton.pressed.connect(this, this.findButtonPressed);
  this.ui.drawingSubstitutionCB.stateChanged.connect(this, this.drawingSubstitutionCheckBoxStateChanged);
  this.ui.pasteByNameCB.stateChanged.connect(this, this.pasteByNameStateChanged);
  this.ui.pasteLocalValuesCB.stateChanged.connect(this, this.pasteLocalValuesChanged);

  // Hide controls for planned features.
  this.ui.resetCacheButton.hide();

  // get local preference
  this.pasteByName = preferences.getBool( "POSE_COPIER_PASTE_BY_NAME", false );
  this.ui.pasteByNameCB.checked = this.pasteByName;
  this.pasteLocalValues = preferences.getBool("POSE_COPIER_PASTE_LOCAL_VALUES", false);
  this.ui.pasteLocalValuesCB.checked = this.pasteLocalValues;
  this.ui.drawingSubstitutionCB.checked = preferences.getBool("POSE_COPIER_FILL_NEXT_KEY_EXPOSURE", false);

  this.ui.pairingCB.checked = preferences.getBool("PASTE_IS_LOCKED_TO_AN_ELEMENT", true);
  this.ui.useExcludedModulesCB.checked = preferences.getBool("USE_OF_EXCLUDED_MODULES_LIST", true);
  var width = preferences.getInt("CURRENT_WIDTH_OF_THE_POSE_COPIER_DIALOG", UiLoader.dpiScale(425));
  var height = preferences.getInt("CURRENT_HEIGHT_OF_THE_POSE_COPIER_DIALOG", UiLoader.dpiScale(525));
  var X = preferences.getInt("CURRENT_X_POS_OF_THE_POSE_COPIER_DIALOG", UiLoader.dpiScale(300));
  var Y = preferences.getInt("CURRENT_Y_POS_OF_THE_POSE_COPIER_DIALOG", UiLoader.dpiScale(200));
  this.ui.setGeometry(X, Y, width, height);

  this.open();
}


function TB_Pose_Copier()
{
  var f = new PoseCopierDialog();
  f.ui.show();
}

PoseCopierUI = {
    dialog: null,
    listeners: [],
    updateTemplateList: function(msg) { 
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](msg);
        }
    },
    addListener: function(fn) { 
      this.listeners.push(fn); 
    },
};

function CreateTemplatesMenu()
{
    var self = this;
    this.templates = [];

    this.refreshMenu = function() {
        this.ui.updateTpl.clear();
        this.ui.updateTpl.addItem("choose a tpl");
        for (var i = 0; i < this.templates.length; i++) {
            this.ui.updateTpl.addItem(this.templates[i].name);
        }
    };

    PoseCopierUI.addListener(function(msg) {

        self.templates.push({
            name: msg.name,
            path: msg.path
        });
      
        self.refreshMenu();
    });

    this.ui.updateTpl.currentIndexChanged.connect(this, function(index) {
      if (index > 0) {
          var tpl = this.templates[index - 1]; 
          MessageLog.trace("Template : " + tpl.name);
          MessageLog.trace("path of tpl : " + tpl.path);
          this.open(true, tpl.path);
        }
    });

    this.refreshMenu();
}

TB_Pose_Copier()