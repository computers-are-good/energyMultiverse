
function fadeIn(element, duration) {
    element.style.opacity = 0;
    animation(element, duration * 1000, 0, performance.now(), duration * 1000);
}
function animation(element, totalDuration, opacity, t0, remainingTime) {
    let t1 = performance.now();
    let deltaT = t1 - t0;
    t0 = t1;
    let deltaOpacity = deltaT / totalDuration;
    opacity += deltaOpacity;
    remainingTime -= deltaT;
    element.style.opacity = opacity;
    if (remainingTime > 0) {
        requestAnimationFrame(_ => {
            animation(element, totalDuration, opacity, t0, remainingTime)
        });
    }
}
export default fadeIn;