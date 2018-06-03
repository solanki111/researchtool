function openTab(evt, tabName) {
    
    
    
    var i, tabcontent, tablinks;

    console.log(tabName);


    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }



    // Get all elements with class="link" and remove the class "active"
    tablinks = document.getElementsByClassName("link");
    for (i = 0; i < tablinks.length; i++) {

        tablinks[i].className = tablinks[i].className.replace(" active", "");


    }


    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";



}



