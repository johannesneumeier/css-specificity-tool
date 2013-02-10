$(function() {

	$(document).on('click', '.calculate', Tool.calculate);
	$(document).on('click', '.remove', Tool.removeRow);
	$(document).on('click', '.clear', Tool.clearRow);
	$('.add').on('click', Tool.newRow);

});


var Tool = {};


Tool.calculate = function () {

	var $li     = $(this).parent(),
		$clear  = $li.find('.clear'),
		$remove = $li.find('.remove'),
		$input  = $li.find('input[name="selector"]'),
		$span   = $li.find('.specificity-string');

	$span.html(Specificity.calculate($input.val()).string);
	$clear.removeAttr('disabled');
	if ($li.siblings().length > 0) {
		$remove.removeAttr('disabled');
	}

}


Tool.newRow = function () {

	var $list = $('.selectors'),
		$newRow = $list.find('li:last').clone();

	$newRow.find('.specificity-string').html($newRow.find('.specificity-string').data('default'));
	$newRow.find('input[name="selector"]').val("");
	$newRow.find('.clear').attr('disabled', 'disabled');

	$newRow.find('.remove').removeAttr('disabled');
	$list.find('.remove').removeAttr('disabled');
	$list.append($newRow);

}


Tool.removeRow = function () {

	var $li = $(this).parent(),
		$list = $li.parent();

	$li.remove();

	if ($li.siblings().length > 0) {
		$list.find('.remove').removeAttr('disabled');
	} else {
		$list.find('.remove').attr('disabled', 'disabled');
	}

}


Tool.clearRow = function () {
	
	var $li = $(this).parent();

	$li.find('input[name="selector"]').val("");
	$li.find('.specificity-string').html($li.find('.specificity-string').data('default'));

}