var Tool = {};

$(function() {

	// cached selectors for static elements
	Tool.$sort = $('.sort');
	Tool.$add  = $('.add');
	Tool.$list = $('.selectors');
	Tool.onResetDefaultTo = '<span class="specificity-a specificity-undefined">?</span>,<span class="specificity-b specificity-undefined">?</span>,<span class="specificity-c specificity-undefined">?</span>,<span class="specificity-d specificity-undefined">?</span>';

	$(document).on('click', '.calculate', Tool.calculateFromEvent);
	$(document).on('keyup', 'input[name="selector"]', Tool.calculateFromEvent);
	$(document).on('click', '.remove', Tool.removeRow);
	$(document).on('click', '.clear', Tool.clearRow);

	$(document).on('mouseover', '.specificity-string span', Tool.showMatchesTooltip);
	$(document).on('mouseout', '.specificity-string span, .specificity-string span ul', Tool.hideMatchesTooltip);

	// on refresh calculate any selector in the first input
	$('input[name="selector"]').each(function () {
		if ($(this).val() != '') {		
			Tool.calculate($(this).parent('li'));
		}
	});

	Tool.$sort.on('click', Tool.sortRows);
	Tool.$add.on('click', Tool.newRow);

});


Tool.calculateFromEvent = function () {

	Tool.calculate($(this).parent());

}


Tool.calculate = function ($li) {

	var $clear  = $li.find('.clear'),
		$remove = $li.find('.remove'),
		$span   = $li.find('.specificity-string'),
		$input  = $li.find('input[name="selector"]'),		
		specificity = Specificity.calculate($input.val());

	console.log(specificity);

	if (specificity) {
		console.log('Tool.calculate: ');

		var html = '<span class="specificity-a">' + specificity.values.a + '</span>,' +
				   '<span class="specificity-b">' + specificity.values.b + '</span>,' +
				   '<span class="specificity-c">' + specificity.values.c + '</span>,' +
				   '<span class="specificity-d">' + specificity.values.d + '</span>';

		$span.html(html);
		$li.data('specificity', specificity.string);
		$li.data('specificity-matches', specificity.matches);

		console.log("data spec: " + $li.data('specificity'));

		$clear.removeAttr('disabled');
		if ($li.siblings().length > 0) {
			$remove.removeAttr('disabled');
		}
	}

}


Tool.newRow = function () {

	var $newRow = Tool.$list.find('li:last').clone();

	$newRow.find('.specificity-string span').each(function () {
		$(this).data('default');
	});
	$newRow.find('input[name="selector"]').val("");
	$newRow.find('.clear').attr('disabled', 'disabled');

	$newRow.find('.remove').removeAttr('disabled');
	Tool.$list.find('.remove').removeAttr('disabled');
	Tool.$list.append($newRow);

	if (Tool.$list.children().length > 1) {
		Tool.$sort.removeAttr('disabled');
	} else {	
		Tool.$sort.attr('disabled', 'disabled');	
	}

}


Tool.removeRow = function () {

	var $li   = $(this).parent();

	$li.remove();

	if (Tool.$list.children().length > 1) {
		Tool.$list.find('.remove').removeAttr('disabled');
	} else {
		Tool.$list.find('.remove').attr('disabled', 'disabled');
	}

	if (Tool.$list.children().length > 1) {
		Tool.$sort.removeAttr('disabled');
	} else {	
		Tool.$sort.attr('disabled', 'disabled');	
	}

}


Tool.clearRow = function () {
	
	var $li = $(this).parent();

	$li.find('input[name="selector"]').val("");
	$li.find('.specificity-string')
		.html(Tool.onResetDefaultTo);

}


Tool.sortRows = function () {

	
	Tool.$list.children().each(function () {
		Tool.calculate($(this));
	})
	
	var newOrder = Tool.$list.children().sort(Tool.sort);

	Tool.$list.children().remove();

	for (var i = 0; i < newOrder.length; i++) {
		Tool.$list.append(newOrder[i]);
	}

}


Tool.sort = function (liA, liB) {

	var specA = $(liA).data('specificity').split(','),
	    specB = $(liB).data('specificity').split(',');

	for (var i = 0; i < specA.length; i++) {

		if (specA[i] < specB[i]) {
			return 1;
		} else if (specA[i] > specB[i]) {
			return -1;
		}
	}

	return 0;

}


Tool.showMatchesTooltip = function () {

	console.log($(this).parent().parent().data('specificity-matches'));

	var $this      = $(this),
		part       = "", 
		partResult = [],
		html       = "",
		matches    = $this.parent().parent().data('specificity-matches');

	partResult = $this.attr('class').match(/^specificity-(a|b|c|d).*/i);
	part = partResult[1];

	if (matches) {
		if (matches[part].length > 0) {
			html = '<ul><li>' + matches[part].join('</li><li>') + '</li></ul>';
			console.log(matches[part]);
			$this.append(html).find('ul').fadeIn('fast');
		}
	} else {
		// not yet calculated
	}

}


Tool.hideMatchesTooltip = function () {

	var $ul = $(this).parentsUntil('li').parent().find('.specificity-string ul');

	$ul.fadeOut('fast', function () {
		remove();
	});

}