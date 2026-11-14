gdjs.Main_32MenuCode = {};
gdjs.Main_32MenuCode.localVariables = [];
gdjs.Main_32MenuCode.idToCallbackMap = new Map();
gdjs.Main_32MenuCode.GDText_9595GameNameObjects1= [];
gdjs.Main_32MenuCode.GDText_9595GameNameObjects2= [];
gdjs.Main_32MenuCode.GDArcadeButtonObjects1= [];
gdjs.Main_32MenuCode.GDArcadeButtonObjects2= [];
gdjs.Main_32MenuCode.GDQuitButtonObjects1= [];
gdjs.Main_32MenuCode.GDQuitButtonObjects2= [];
gdjs.Main_32MenuCode.GDNewTiledSpriteObjects1= [];
gdjs.Main_32MenuCode.GDNewTiledSpriteObjects2= [];
gdjs.Main_32MenuCode.GDChillDriveButtonObjects1= [];
gdjs.Main_32MenuCode.GDChillDriveButtonObjects2= [];
gdjs.Main_32MenuCode.GDTotalWalletTextObjects1= [];
gdjs.Main_32MenuCode.GDTotalWalletTextObjects2= [];


gdjs.Main_32MenuCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_RheinRotos_Ownership").setBoolean(true);
}
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "PlayerTotalMoney", runtimeScene, runtimeScene.getGame().getVariables().getFromIndex(6));
}
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "PlayerCarFog", runtimeScene, runtimeScene.getGame().getVariables().getFromIndex(8));
}
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "PlayerCarVillager", runtimeScene, runtimeScene.getGame().getVariables().getFromIndex(9));
}
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "PlayerCarComrade", runtimeScene, runtimeScene.getGame().getVariables().getFromIndex(5));
}
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "PlayerCarCoupe", runtimeScene, runtimeScene.getGame().getVariables().getFromIndex(7));
}
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "PlayerCarAuswanderer", runtimeScene, runtimeScene.getGame().getVariables().getFromIndex(4));
}
}

}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("TotalWallet").setNumber(runtimeScene.getGame().getVariables().getFromIndex(6).getAsNumber());
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(8).getAsNumber() == 0);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Fog_Ownership").setBoolean(false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(8).getAsNumber() == 1);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Fog_Ownership").setBoolean(true);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(9).getAsNumber() == 0);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Villager_Ownership").setBoolean(false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(9).getAsNumber() == 1);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Villager_Ownership").setBoolean(true);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(5).getAsNumber() == 0);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Comrade_Ownership").setBoolean(false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(5).getAsNumber() == 1);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Comrade_Ownership").setBoolean(true);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(7).getAsNumber() == 0);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Coupe_Ownership").setBoolean(false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(7).getAsNumber() == 1);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Coupe_Ownership").setBoolean(true);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(4).getAsNumber() == 0);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Auswanderer_Ownership").setBoolean(false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(4).getAsNumber() == 1);
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(3).getChild("PlayerCar_Auswanderer_Ownership").setBoolean(true);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("ArcadeButton"), gdjs.Main_32MenuCode.GDArcadeButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Main_32MenuCode.GDArcadeButtonObjects1.length;i<l;++i) {
    if ( gdjs.Main_32MenuCode.GDArcadeButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.Main_32MenuCode.GDArcadeButtonObjects1[k] = gdjs.Main_32MenuCode.GDArcadeButtonObjects1[i];
        ++k;
    }
}
gdjs.Main_32MenuCode.GDArcadeButtonObjects1.length = k;
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(1).setNumber(1);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Car Selection Scene", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("ChillDriveButton"), gdjs.Main_32MenuCode.GDChillDriveButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Main_32MenuCode.GDChillDriveButtonObjects1.length;i<l;++i) {
    if ( gdjs.Main_32MenuCode.GDChillDriveButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.Main_32MenuCode.GDChillDriveButtonObjects1[k] = gdjs.Main_32MenuCode.GDChillDriveButtonObjects1[i];
        ++k;
    }
}
gdjs.Main_32MenuCode.GDChillDriveButtonObjects1.length = k;
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(1).setNumber(2);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Car Selection Scene", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("QuitButton"), gdjs.Main_32MenuCode.GDQuitButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Main_32MenuCode.GDQuitButtonObjects1.length;i<l;++i) {
    if ( gdjs.Main_32MenuCode.GDQuitButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.Main_32MenuCode.GDQuitButtonObjects1[k] = gdjs.Main_32MenuCode.GDQuitButtonObjects1[i];
        ++k;
    }
}
gdjs.Main_32MenuCode.GDQuitButtonObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.stopGame(runtimeScene);
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("TotalWalletText"), gdjs.Main_32MenuCode.GDTotalWalletTextObjects1);
{for(var i = 0, len = gdjs.Main_32MenuCode.GDTotalWalletTextObjects1.length ;i < len;++i) {
    gdjs.Main_32MenuCode.GDTotalWalletTextObjects1[i].getBehavior("Text").setText("Balance: " + gdjs.evtTools.variable.getVariableString(runtimeScene.getGame().getVariables().getFromIndex(3).getChild("TotalWallet")));
}
}
}

}


};

gdjs.Main_32MenuCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.Main_32MenuCode.GDText_9595GameNameObjects1.length = 0;
gdjs.Main_32MenuCode.GDText_9595GameNameObjects2.length = 0;
gdjs.Main_32MenuCode.GDArcadeButtonObjects1.length = 0;
gdjs.Main_32MenuCode.GDArcadeButtonObjects2.length = 0;
gdjs.Main_32MenuCode.GDQuitButtonObjects1.length = 0;
gdjs.Main_32MenuCode.GDQuitButtonObjects2.length = 0;
gdjs.Main_32MenuCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.Main_32MenuCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.Main_32MenuCode.GDChillDriveButtonObjects1.length = 0;
gdjs.Main_32MenuCode.GDChillDriveButtonObjects2.length = 0;
gdjs.Main_32MenuCode.GDTotalWalletTextObjects1.length = 0;
gdjs.Main_32MenuCode.GDTotalWalletTextObjects2.length = 0;

gdjs.Main_32MenuCode.eventsList0(runtimeScene);
gdjs.Main_32MenuCode.GDText_9595GameNameObjects1.length = 0;
gdjs.Main_32MenuCode.GDText_9595GameNameObjects2.length = 0;
gdjs.Main_32MenuCode.GDArcadeButtonObjects1.length = 0;
gdjs.Main_32MenuCode.GDArcadeButtonObjects2.length = 0;
gdjs.Main_32MenuCode.GDQuitButtonObjects1.length = 0;
gdjs.Main_32MenuCode.GDQuitButtonObjects2.length = 0;
gdjs.Main_32MenuCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.Main_32MenuCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.Main_32MenuCode.GDChillDriveButtonObjects1.length = 0;
gdjs.Main_32MenuCode.GDChillDriveButtonObjects2.length = 0;
gdjs.Main_32MenuCode.GDTotalWalletTextObjects1.length = 0;
gdjs.Main_32MenuCode.GDTotalWalletTextObjects2.length = 0;


return;

}

gdjs['Main_32MenuCode'] = gdjs.Main_32MenuCode;
