/* particleConfig = {
    particleX,
    particleY,
    particleNumber,
    particleLifetime,
    particleColor
    particleSize
    particleSpeed
} */

let allParticles = [];

function particles(particleConfig, divToAppendTo) {
    for (let i = 0; i < particleConfig.particleNumber; i++) {
        const newParticleDiv = document.createElement("div");
        const newParticle = {
            theta: Math.PI * 2 * Math.random(),
            particleX: particleConfig.particleX - 5 + Math.random() * 10,
            particleY: particleConfig.particleY - 5 + Math.random() * 10,
            lifeLeft: particleConfig.particleLifetime,
            totalLife: particleConfig.particleLifetime,
            speed: particleConfig.particleSpeed,
            div: newParticleDiv
        }
        newParticleDiv.classList.add("particle");
        newParticleDiv.style.zIndex = particleConfig.zIndex ?? 10;
        newParticleDiv.style.display = "block";
        newParticleDiv.style.position = "absolute";
        newParticleDiv.style.backgroundColor = particleConfig.particleColor;
        newParticleDiv.style.height = `${particleConfig.particleSize}px`;
        newParticleDiv.style.width = `${particleConfig.particleSize}px`;
        newParticleDiv.style.left = `${particleConfig.particleX}px`;
        newParticleDiv.style.top = `${particleConfig.particleY}px`;
        if (divToAppendTo) {
            divToAppendTo.appendChild(newParticleDiv);
        } else {
            document.body.appendChild(newParticleDiv);
        }
        allParticles.push(newParticle);
    }
}

let t0 = performance.now();
function animateParticles() {
    let t1 = performance.now();
    let deltaT = t1 - t0;
    t0 = t1;

    allParticles = allParticles.filter(e => {
        e.lifeLeft -= deltaT;
        e.particleX += Math.cos(e.theta) * e.speed * deltaT;
        e.particleY += Math.sin(e.theta) * e.speed * deltaT;

        e.div.style.left = `${e.particleX}px`;
        e.div.style.top = `${e.particleY}px`;
        e.div.style.opacity = e.lifeLeft / e.totalLife;

        if (e.lifeLeft < 0) {
            e.div.remove();
            return false;
        } else {
            return true;
        }
    })
    requestAnimationFrame(animateParticles);
}
animateParticles();
export {particles};