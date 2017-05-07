import Utils from '../utils';

export const Scrollable = function (onBottomReach) {
    return (element, isInitialized, context) => {
        if (!isInitialized) {
            element.onscroll = Utils.debounce(function (event) {
                if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
                    onBottomReach();
                }
            }, 100);
        }
    };
};