/**
 * Vars
 */
var tipAlignmentReplicant = nodecg.Replicant("tipAlignment", {defaultValue: "left"});
var tipTimeReplicant = nodecg.Replicant("tipTime", {defaultValue: {"show":5, "period": 20}});
var tipDisplayAmountReplicant = nodecg.Replicant("tipDisplayAmount", {defaultValue: 0});
var tipDisplayModeReplicant = nodecg.Replicant("tipDisplayMode", {defaultValue: 1});
var tipArrayReplicant = nodecg.Replicant("tipList",
	{defaultValue: [{"1":"1"},{"2":"2"},{"3":"3"},{"4":"4"},{"5":"5"}]});
var tipReplicant = nodecg.Replicant("tipToDisplay");
var tipShowReplicant = nodecg.Replicant("tipShow", {defaultValue: 0});

var tipList = $('#tryp-stn_tipList');
var tipCount = $('#tryp-stn_totalNewTips');
var tipSave = $('#tryp-stn_settingsModalButton');

var settingsFields = {};

var newTipCount = 0;
var maxTips = 5;
var tipArray = [{},{},{},{},{}];

nodecg.listenFor('tip','lfg-streamtip',function(data){
	parseTip(data);
});

tipTimeReplicant.on('change', function(oldValue, newValue){
	$("input[name='tipDisplayTime']").val(newValue["show"]);
	$("input[name='tipDisplayPeriod']").val(newValue["period"]);
});

tipAlignmentReplicant.on('change', function(oldValue, newValue){
	$("input[name='alignment']").val([newValue]);
});

tipDisplayAmountReplicant.on('change', function(oldValue, newValue){
	$("input[name='displayAmount']").val([newValue]);
});

tipDisplayModeReplicant.on('change', function(oldValue, newValue){
	$('input[name=displayMode]').val([newValue]);
});

tipSave.click(function(){
	saveSettings();
});

$("#js-showTip").click(function(){
	tipShowReplicant.value = 1 -tipShowReplicant.value;
});

function parseTip(tip) {
	var newTip = {
		"_id": tip._id,
		"currency": tip.currencySymbol,
		"amount": tip.amount,
		"username": tip.username,
		"email": tip.email,
		"firstName": tip.firstName,
		"lastName": tip.lastName,
		"note": tip.note
	}
	updateList(newTip);
}

function updateTipCount() {
	tipCount.text(newTipCount);
}

function updateList(tip){
	var newTip = true;
	for (var i = tipArray.length - 1; i >= 0; i--) {
		if (tip._id == tipArray[i]._id)
			newTip = false;
	};
	if (newTip){
		tipArray.unshift(tip);
		if(tipArray.length > maxTips)
			tipArray.pop();
		displayTip(tip);
		tipArrayReplicant.value = tipArray;
		tipReplicant.value = tip;
		newTipCount++;
		updateTipCount(newTipCount);
	}
}

function displayTip(tip){

	var newItem = document.createElement("li");
	var newTipper = document.createElement("span");
	var newTooltip = document.createElement("div");
	var newInfo = document.createElement("div");
	var newName = document.createElement("div");
	var newUsername = document.createElement("div");
	var newEmail = document.createElement("div");
	var newTip = document.createElement("div");
	var newNote = document.createElement("p");

	newItem.className = "tryp-stn_tip";
	newTooltip.className = "tryp-stn_tooltip";
	newInfo.className = "tryp-stn_tooltip_info";
	newName.className = "tryp-stn_tooltip_name";
	newUsername.className = "tryp-stn_tooltip_username";
	newEmail.className = "tryp-stn_tooltip_email";
	newTip.className = "tryp-stn_tooltip_tip";
	newNote.className = "tryp-stn_tooltip_note";

	newTipper.innerHTML = tip.username + ": " + tip.currency + tip.amount;
	newName.innerHTML = tip.firstName + " " + tip.lastName;
	newUsername.innerHTML = tip.username;
	newEmail.innerHTML = tip.email;
	newTip.innerHTML = tip.currency + tip.amount;
	newNote.innerHTML = tip.note;

	newInfo.appendChild(newName);
	newInfo.appendChild(newUsername);
	newInfo.appendChild(newEmail);

	newTooltip.appendChild(newTip);
	newTooltip.appendChild(newInfo);
	newTooltip.appendChild(newNote);

	newItem.appendChild(newTipper);
	newItem.appendChild(newTooltip);
		tipList.prepend(newItem);
	while (tipList.children().length > maxTips){
		tipList.children().last().remove();
	}
}

function saveSettings(){
	tipAlignmentReplicant.value = settingsFields.alignment.find("input[name='alignment']:checked").val();
	var tipTimeObject = {
		"show": parseInt($("input[name='tipDisplayTime']").val(), 10),
		"period": parseInt($("input[name='tipDisplayPeriod']").val(), 10)
	};
	tipTimeReplicant.value = tipTimeObject;
	tipDisplayAmountReplicant.value = settingsFields.displayAmount.find("input[name='displayAmount']:checked").val();
	tipDisplayModeReplicant.value = settingsFields.displayMode.find("input[name='displayMode']:checked").val();
}

$(document).ready(function(){
	updateTipCount();
	nodecg.readReplicant('tipList', function(value){
		tipArray = value;
		for (var i = tipArray.length - 1; i >= 0; i--) {
			displayTip(tipArray[i]);
		};
	});
	settingsFields.alignment = $('#tryp-stn_screenPosition');
	settingsFields.displayTime = $('#tryp-stn_displayTime');
	settingsFields.displayAmount = $('#tryp-stn_displayAmount');
	settingsFields.displayMode = $('#tryp-stn_displayMode');
	$('input[type=radio][name=displayMode]').change(function() {
		if (this.value > 0)
			$('#tryp-stn_displayPeriod').hide(200);
		else
			$('#tryp-stn_displayPeriod').show(200);
	});
});

$('.tryp-streamtip-notifier .panel-heading').append('<button class="btn btn-info btn-xs ncg-f_panel-btn" data-toggle="modal" data-target="#tryp-stn_settingsModal" title="Tip Settings"><i class="fa fa-cog"></i></button>');