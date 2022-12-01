function initButtons() {
	var button = document.getElementsByClassName("button");

	var addSelectClass = function(){
		removeSelectClass();
		this.classList.add('selected');
	}

	var removeSelectClass = function(){
		for (var i =0; i < button.length; i++) {
			button[i].classList.remove('selected')
		}
	}

	for (var i =0; i < button.length; i++) {
		button[i].addEventListener("click",addSelectClass);
	}
}

