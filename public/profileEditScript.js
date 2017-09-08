$(document).ready(function(){
    addFunction = function(promptMsg1, promptMsg2, dataType, list) {
        const txt = prompt(promptMsg1, promptMsg2);
        if (!(txt == null || txt == "")) {
            const data = {};
            data.txt = txt;
            data.type = dataType;
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: 'http://localhost:3000/'+uid+'/profile/add',                      
                success: function(data, status) {
                    if (status === 'success') {
                        const i = document.createElement("i");
                        i.classList.add("fa");
                        i.classList.add("fa-times");
                        i.classList.add('red-cross');

                        const a = document.createElement("a");
                        a.classList.add("ml-4");
                        a.append(i);
                        
                        const t = document.createTextNode(txt)

                        const newItem = document.createElement("li");
                        newItem.append(t);
                        newItem.append(a);
                        
                        /*
                        //It works till I reload the page
                        var final = $("ul#"+list);
                        final.off('click');
                        final.on('click', 'li a', function () {
                            var idx = final.children().index($(this).closest('li'));
                            deleteFunction(dataType, idx, $(this).closest('li'));
                        });
                        $(final).append(newItem);
                        */
                    
                        $("ul#"+list).append(newItem).on('click', 'li a', function() {
                             alert('Please reload the page to delete');
                        });
                        
                    }
                }
            });
        }
    }

    $("a#classesAndSubjects").click(function(){
        addFunction("Classes And Subjects:", "Class 1 to 5 All", 
            "classesAndSubjects", "classesAndSubjectsList");
    });

    $("a#educationalBackground").click(function(){
        addFunction("Background:", "School from Willes Little Flower", 
            "educationalBackground", "educationalBackgroundList");
    });

    $("a#experiences").click(function(){
        addFunction("Experience:", "Two years teaching experience", 
            "experiences", "experiencesList");
    });

    $("a#times").click(function(){
        addFunction("Time:", "Monday 10am - 2pm", 
            "times", "timesList");
    });
    
    $("a#contactNumbers").click(function(){
        addFunction("Contact Number:", "", 
            "contactNumbers", "contactNumbersList");
    });

    $("a#currentAddress").click(function(){
        const txt = prompt("Current Address:", "598 Block-C, Malibagh Chowdhury Para, Dhaka-1219");
        if (!(txt == null || txt == "")) {
            const data = {};
            data.txt = txt;
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: 'http://localhost:3000/'+uid+'/profile/currentAddress',                      
                success: function(data, status) {
                    if (status === 'success') {
                        $("p#currentAddress").text(txt);
                    }
                }
            });
        }
    });

    $("a#awardsAndAccomplishments").click(function(){
        addFunction("Awards and Accomplishments:", "Daily Start award in A'Level", 
            "awardsAndAccomplishments", "awardsAndAccomplishmentsList");
    });

    $('#uploadForm').submit(function() {
        $("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                const a = document.createElement("a");
                a.textContent = (response.name).toString();
                a.setAttribute('href', "/download/"+(response.path).toString());

                const i = document.createElement("i");
                i.classList.add("fa");
                i.classList.add("fa-times");
                i.classList.add('red-cross');

                const a2 = document.createElement("a");
                a2.classList.add("ml-4");
                a2.setAttribute('href', 'javascript:;');
                a2.append(i);

                const newItem = document.createElement("li");
                newItem.append(a);
                newItem.append(a2);

                $("ul#certificatesList").append(newItem);
                $("#status").empty();

            }
        });
        //Very important line, it disable the page refresh.
        return false;
    });   

    $('#uploadForm2').submit(function() {
        $("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                const a = document.createElement("a");
                a.textContent = (response.name).toString();
                a.setAttribute('href', "/download/"+(response.path).toString());

                const i = document.createElement("i");
                i.classList.add("fa");
                i.classList.add("fa-times");
                i.classList.add('red-cross');

                const a2 = document.createElement("a");
                a2.classList.add("ml-4");
                a2.setAttribute('href', 'javascript:;');
                a2.append(i);

                const newItem = document.createElement("li");
                newItem.append(a);
                newItem.append(a2);

                $("ul#sampleResourcesList").append(newItem);
                $("#status").empty();

            }
        });
        //Very important line, it disable the page refresh.
        return false;
    });   

    const deleteFunction = function(type, index, item) {
        //console.log(item);
        const data = {};
        data.type = type;
        data.index = index;
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/'+uid+'/profile/delete',         
            success: function(data, status) {
                if (status === 'success') {
                    item.remove();
                }
            }
        });
    }

    $('.deleteClassesAndSubjects').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("classesAndSubjects", index, item);
    });

    $('.deleteEducationalBackground').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("educationalBackground", index, item);
    });

    $('.deleteExperiences').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("experiences", index, item);
    });

    $('.deleteTimes').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("times", index, item);
    });

    $('.deleteContactNumber').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("contactNumbers", index, item);
    });

    $('.deleteAwardsAndAccomplishments').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("awardsAndAccomplishments", index, item);
    });

    $('.deleteCertificates').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("certificates", index, item);
    });

    $('.deleteSampleResources').click(function() {
        const item = $(this).parent();  //list item
        const index = item.index();
        deleteFunction("sampleResources", index, item);
    });

    $('#uploadImage').submit(function() {
        $("#status").empty().text("File is uploading...");
         $(this).ajaxSubmit({
            error: function(xhr) {
                alert('Please upload a file with extension jpg|jpeg|png|gif');
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                $('#image').attr('src', '../'+response.path);
            }
        });
        $("#status").empty();
        //Very important line, it disable the page refresh.
        return false;
    });   
    
});