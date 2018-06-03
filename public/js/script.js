$(document).ready(function() {
    $('#studiesdatatable').DataTable({
        "order": [
            [0, "desc"]
        ]
    });



    //triggered when modal is about to be shown
    $('#renameModal').on('show.bs.modal', function(e) {

        //get data-id attribute of the clicked element
        var studyId = $(e.relatedTarget).data('study-id');
        var studyName = $(e.relatedTarget).data('study-name');

        //populate the textbox
        $(e.currentTarget).find('input[name="studynewname"]').val(studyName);
        $(e.currentTarget).find('form[id="renameform"]').attr('action', '/study/rename/' + studyId);


    });






});