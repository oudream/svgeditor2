var ElemTypeSet = ['path', 'line', 'ellipse', 'rect', 'image'];

Session.setDefault('prefixId', Random.id() + '-');

s = Snap('#svgcontent > g:nth-child(2)');

$(document).ready( function() {
  $('#debug_printElems').click( function() {
    getElems();
  });
});

Meteor.startup(function() {
  Meteor.setTimeout(function() {
    s = Snap('#svgcontent > g:nth-child(2)');
  }, 1000);
});

getElems = function getElems() {
  //for each Element Type Set
  $.each(ElemTypeSet, function(index, element) {
    var type = element;
    //grab the stuff in svgcontent second child and for each thing
    $('#svgcontent g:eq(2) ' + element).each(function(index, element) {
      var obj = {type: type};
      //enumerate the attributes
      $.each(this.attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      //Check if it exists and pick one
      var exists = Content.findOne({id: element.id});
      if (exists) Content.upsert({_id: exists._id}, { $set: obj });
      else Content.insert(obj);
    });
  });
}

printElem = function printElem(el) {
  el.forEach(function(doc) {
    var attr = {};
    $.each(doc, function(k, v, l) {
      if (k !== '_id') {
        attr[k] = v;
      }
    });
    var drawnSvg = s.el(doc.type);
    drawnSvg.attr(attr);
    drawnSvg.node.id = attr.id;
  });
}