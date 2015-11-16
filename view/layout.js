var tipperAlignment = nodecg.Replicant('tipAlignment');
var tipperTime = nodecg.Replicant('tipTime');
var tipperDisplayAmount = nodecg.Replicant('tipDisplayAmount');
var tipperDisplayMode = nodecg.Replicant('tipDisplayMode');
var tipperVar = nodecg.Replicant('tipToDisplay');
var tipperShow = nodecg.Replicant("tipShow");

var tipContainer = $("#tip_container");
var tip = $("#tip_notification");
var tipTipper = $("#tip_tipper");
var tipTip = $("#tip_tip");
var tipAmount = $("#tip_amount");
var readyToShow = true;
var showSeconds = 5;
var periodSeconds = 10;
var timer = false;
var displayAmount = 0;
var displayMode = 1;
var lastData;
var lastTiming;

tipperVar.on('change', function(oldValue, newValue) {
	newTipper(newValue);
	lastData = newValue;
});

tipperAlignment.on('change', function(oldValue, newValue) {
	updatePosition(oldValue, newValue);
});

tipperTime.on('change', function(oldValue,newValue){
	updateTiming(newValue);
	lastTiming = newValue;
});

tipperDisplayAmount.on('change', function(oldValue,newValue){
	displayTip(newValue);
});

tipperDisplayMode.on('change', function(oldValue,newValue){
	displayMode = newValue;
});

tipperShow.on('change', function(oldValue,newValue){
	if (!timer)
		displayTipper();
});

function displayTip(display){
	if(display >  0)
		tipTip.show();
	else
		tipTip.hide();
}

function displayTipper(){
	if (!timer){
		if (displayMode < 1) {
			tip.addClass("show");
			setTimeout(function() {
				tip.removeClass("show");
			}, showSeconds*1000);
		} else {
			newTipper(lastData);
		}
	}
}

function updatePosition(oldPos, newPos) {
	tipContainer.removeClass(oldPos).addClass(newPos);
}

function updateTiming(timing){
	showSeconds = timing["show"];
	periodSeconds = timing["period"];
	if (displayMode < 1) {
		clearInterval(timer);
		timer = false;
		startTimer();
	}
}

function newTipper(data) {
	if(displayMode > 0){
		if(timer) {
			setTimeout(function (){
				newTipper(data);
			}, 1000);
			return;
		}

		tipTipper.html(data.username);
		tipAmount.html(data.currency + data.amount);
		tip.addClass("show");

		timer = setTimeout(function() {
			tip.removeClass("show");
			setTimeout(function() {
				timer = false;
			}, 500);
		}, showSeconds*1000);
	} else {
		tipTipper.html(data.username);
		tipAmount.html(data.currency + data.amount);
		startTimer();
	}
}

function startTimer() {
	if (displayMode < 1) {
		if (!timer) {
			tip.addClass("show");
			timer = setTimeout(function() {
				tip.removeClass("show");
				setTimeout(function() {
					timer = false;
					startTimer();
				}, (periodSeconds - showSeconds) * 1000);
			},showSeconds*1000);
		}
	}
}