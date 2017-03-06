export const Utils = {
    // Get element of id selector
    getEl(id){
        return document.getElementById(id) || false;
    },
    formatMoney(n){
        return accounting.formatMoney(n);
    },
    // return if element is visible or not
    isHidden(el) {
        console.log(el);
        let res = 'none';
        if(el != false){
            let style = window.getComputedStyle(el,null);
            res = (style.display === 'none');
        }
        return res;
    },
    dynamicSort(property) {
        let sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },
    hours(){
        let hours = [];
        for(let i = 0; i < 24; i++)
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
        for (let i = 0; i < array.length; i++) {
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
        
        let hours = parseInt(minutes / 60); 
        minutes = minutes % 60;
        return (hours < 10 ? '0' + hours:hours) + ':' + (minutes < 10 ? '0' + minutes:minutes) + ':00';
    
    },
    getMinutesOfTime(hour) {

        let arr = hour.split(':');
        let hours = arr[0];
        let minutes = arr[1];
        return (hours * 60) + parseInt(minutes);

    },
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    removeDuplicates (array) {
        let sorted = array.slice().sort()
        let result = []

        sorted.forEach((item, index) => {
            if (sorted[index + 1] !== item) {
            result.push(item)
            }
        })
        return result
    }
}


export default Utils;