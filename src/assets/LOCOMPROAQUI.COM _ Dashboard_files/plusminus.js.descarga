//Number Picker Plugin - TobyJ
(function ($) {
  $.fn.numberPicker = function() {
    var dis = 'disabled';
    return this.each(function() {
      var picker = $(this),
          p = picker.find('button:last-child'),
          m = picker.find('button:first-child'),
          input = picker.find('input'), 
          span = picker.find('span'),                
          min = parseInt(input.attr('min'), 10),
          max = parseInt(input.attr('max'), 10),
          step = parseInt(input.attr('step'),10),
          dun = input.attr('data-unidad'),
          sav = input.attr('data-save'),
          det = input.attr('data-detalle'),
          un = input.attr('data-un'),
          unv = input.attr('data-un'),
          inputFunc = function(picker) {
            var i = parseInt(input.val(), 10);
            console.log(un);
            var t = i;
            var g = i;
           
           
            if ( (i <= min) || (!i) ) {
               if(parseInt(min, 10)>=1000 && un=="GR"){ unv = "KG";  t = min/1000; }else{unv = un;}
              span.html(t);
              input.val(min);
              g = min;
              p.prop(dis, false);
              m.prop(dis, true);
               picker.attr('data-after',unv);
            } else if (i >= max) {
               if(parseInt(max, 10)>=1000 && un=="GR"){ unv = "KG";  t = max/1000; }else{unv = un;}
              span.html(t)
              input.val(max);
              g = max;
              p.prop(dis, true); 
              m.prop(dis, false);
               picker.attr('data-after',unv);
            } else {
              if(parseInt(i, 10)>=1000 && un=="GR"){ unv = "KG";  t = i/1000; }else{unv = un;}
               span.html(t);
              g = i;
              p.prop(dis, false);
              m.prop(dis, false);
               picker.attr('data-after',unv);
            }
            if(sav==1)
            {
              EDITARDETALLE(det,g,min,dun);
            }
            
            //setTimeout();
            
            //picker.after().css('content',un);
          },
          changeFunc = function(picker, qty) {
            var q = parseInt(qty, 10),
                i = parseInt(input.val(), 10);
            if ((i < max && (q > 0)) || (i > min && !(q > 0))) 
            {
              
              input.val(i + q);
              /*if(parseInt((i + q), 10)>=1000 && un=="GR")
              {
                unv = "KG"; 
                console.log("Por aca - " + parseInt((i + q), 10) + "  " + un);
                t = (i + q)/1000;
              }
              else
              {
                console.log("Por aca entre- " + parseInt((i + q), 10) + "  " + un);
                t = (i + q);
              }*/
              //span.html(t);
              inputFunc(picker);
            }
          };
      m.click( function(e ){ var num = 1;  e.preventDefault(); console.log("step1-" + step); changeFunc(picker,-(step)); return false; });
      p.click( function(e ){ var num = 1;  e.preventDefault(); console.log("step2-" + step); if(num==1){ num=0; changeFunc(picker,step); } } );
      input.on('change', function(){inputFunc(picker);});
      inputFunc(picker); //init
    });
  };
}(jQuery));
