//jshint esversion:6

var newSpan;
var featuredSpan;
var featureBox;

var allTags = [];
var tagsSelected = [];



$(".clear").on("click", clear);
createList();


function createList() {

  $(".item").remove();

  $.getJSON("data.json", function(json) {

    for (var i = 0; i < json.length; i++) {

      var allTags = json[i].tools.concat(json[i].languages);

      //copied the every() from the web, but it works? true if all tagsSelected show up in allTags.
      if (tagsSelected.length === 0 || tagsSelected.every(r => allTags.includes(r))) {

        if (json[i].new) {
          newSpan = '<span class="new">NEW!</span>';
        } else {
          newSpan = "";
        }

        if (json[i].featured) {
          featuredSpan = '<span class="featured">FEATURED</span>';
          featureBox = "featurebox";
        } else {
          featuredSpan = "";
          featureBox = "";
        }

        var content = `
      <div class="item ${featureBox}">
        <div class="img">
          <img src="${json[i].logo}" alt="photosnap logo">

        </div>
        <div class="info">
         <span class="name">${json[i].company}</span>
         ${newSpan}
         ${featuredSpan}
         <h1>${json[i].position}</h1>
         <span class="small postedAt">${json[i].postedAt} &#8226; </span>
         <span class="small contract">${json[i].contract} &#8226;</span>
         <span class="small location">${json[i].location} only</span>

       </div>
       <div>
        <hr>
        </div>
       <div class="tags">`;

        for (var j = 0; j < json[i].languages.length; j++) {
          content = content + `
        <span class="tag">${json[i].languages[j]}</span>
        `;
        }
        for (j = 0; j < json[i].tools.length; j++) {
          content = content + `
        <span class="tag">${json[i].tools[j]}</span>
        `;
        }

        content = content + `
        </div>
      </div>
      `;

        $(".item-container").append(content);

      }
    }
    //this stuff happens after all is loaded
    $(".tag").on("click", tagClicked);
  });
}


function tagClicked() {
  $(".filter").css("visibility", "visible");

  //currently not in array
  if (!tagsSelected.includes($(this).text())) {
    tagsSelected.push($(this).text());
    displayTags();
  }
}

function displayTags() {

  //remove old tags
  $(".filter-tag").remove();
  $(".x").remove();

  //create new tags
  for (var i = 0; i < tagsSelected.length; i++) {

    var content = `<span class="filter-tag">${tagsSelected[i]}</span><span class="x">X</span>
    `;
    $(".filter-tags").append(content);

  }

  //make new tags clickable
  $(".filter-tag").on("click", tagRemoved);
  $(".x").on("click", tagRemoved);

  createList();
}


function clear() {
  $('.filter').css('visibility', 'hidden');
  tagsSelected = [];
  createList();
}

function tagRemoved() {
  var index = tagsSelected.indexOf($(this).text());

  //in case it is the X button clicked, index cant be found so its -1
  if (index === -1) {
    index = tagsSelected.indexOf($(this).prev().text());
  }
  tagsSelected.splice(index, 1);
  displayTags();
  if (tagsSelected.length === 0) {
    clear();
  }
}
