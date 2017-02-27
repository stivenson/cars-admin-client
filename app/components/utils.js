export const Utils = {
    // Get element of id selector
    getEl(id){
        return document.getElementById(id) || false;
    },
    // format to money
    formatMoney(n, c, d, t){
        var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    },
    // return if element is visible or not
    isHidden(el) {
        console.log(el);
        var res = 'none';
        if(el != false){
            var style = window.getComputedStyle(el,null);
            res = (style.display === 'none');
        }
        return res;
    },
    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },
    hours(){
        var hours = [];
        for(var i = 0; i < 24; i++)
        {
            hours.push(this.zeroFill(i, 2)+":00:00");
            hours.push(this.zeroFill(i, 2)+":30:00");
        }
        hours.push("24:00:00");
        return hours;
    },
    zeroFill( number, width ) {
      width -= number.toString().length;
      if ( width > 0 )
      {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number + "";
    },
    deleteNulls(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == null) {         
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    },
    leftPad(number) {  
        return ((number < 10 && number >= 0) ? '0' : '') + number;
    },
    getTimeOfMinutes(minutes) {
        
        var hours = parseInt(minutes / 60); 
        var minutes = minutes % 60;
        return (hours < 10 ? '0' + hours:hours) + ':' + (minutes < 10 ? '0' + minutes:minutes) + ':00';
    
    },
    getMinutesOfTime(hour) {

        var arr = hour.split(':');
        var hours = arr[0];
        var minutes = arr[1];
        return (hours * 60) + parseInt(minutes);

    },
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    removeDuplicates (array) {
        var sorted = array.slice().sort()
        var result = []

        sorted.forEach((item, index) => {
            if (sorted[index + 1] !== item) {
            result.push(item)
            }
        })
        return result
    }
}


export default Utils;