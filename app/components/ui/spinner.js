import m from 'mithril';

export const Spinner = {
    view(_, attrs) {
        return (
            <div class={"pt-spinner" + ('small' in attrs ? ' pt-small' : '') + ('primary' in attrs ? ' pt-intent-primary' : '')}>
                <div class="pt-spinner-svg-container">
                    <svg viewBox="0 0 100 100">
                        <path class="pt-spinner-track" d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"></path>
                        <path class="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5"></path>
                    </svg>
                </div>
            </div>
        );
    }
};