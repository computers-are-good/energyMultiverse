/* particleConfig = {
    particleX,
    particleY,
    particleNumber,
    particleLifetime,
    particleColor,
    particleSize,
    particleSpeed,
    circular,
    particleScalingRate
    spawnVariance,
    allowXVelocity,
    allowYVelocity,
    direction,
    converge
} */

let allParticles = [];

function particles(particleConfig, divToAppendTo) {
    for (let i = 0; i < particleConfig.particleNumber; i++) {
        const newParticleDiv = document.createElement("div");
        const newParticle = {
            theta: particleConfig.direction ?? Math.PI * 2 * Math.random(),
            particleX: particleConfig.particleX - (particleConfig.spawnVariance ?? 5) + Math.random() * (particleConfig.spawnVariance ?? 5) * 2,
            particleY: particleConfig.particleY - (particleConfig.spawnVariance ?? 5) + Math.random() * (particleConfig.spawnVariance ?? 5) * 2,
            lifeLeft: particleConfig.particleLifetime,
            totalLife: particleConfig.particleLifetime,
            fadeIn: particleConfig.fadeIn ?? 0,
            fadeInLeft: particleConfig.fadeIn ?? 0,
            allowXVelocity: particleConfig.allowXVelocity ?? true,
            allowYVelocity: particleConfig.allowYVelocity ?? true,
            scalingRate: particleConfig.particleScalingRate ?? 0,
            scale: 1,
            speed: particleConfig.particleSpeed,
            div: newParticleDiv
        }

        if (particleConfig.converge) {
            console.log(particleConfig.particleSpeed * particleConfig.particleLifetime / 100)
            const newX = Math.cos(newParticle.theta) * particleConfig.particleSpeed * particleConfig.particleLifetime + particleConfig.particleX;
            const newY = Math.sin(newParticle.theta) * particleConfig.particleSpeed * particleConfig.particleLifetime + particleConfig.particleY;
            newParticle.particleX = newX;
            newParticle.particleY = newY;
            newParticle.theta = newParticle.theta - Math.PI;
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
        if (particleConfig.circular) newParticleDiv.style.borderRadius = "999px";
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
        e.particleX += e.allowXVelocity ? (Math.cos(e.theta) * e.speed * deltaT) : 0;
        e.particleY += e.allowYVelocity ? (Math.sin(e.theta) * e.speed * deltaT) : 0;

        e.div.style.left = `${e.particleX}px`;
        e.div.style.top = `${e.particleY}px`;
        if (e.fadeInLeft > 0) {
            e.fadeInLeft -= deltaT;
            e.div.style.opacity = 1 - e.fadeInLeft / e.fadeIn; 
        } else {
            e.lifeLeft -= deltaT;
            e.div.style.opacity = e.lifeLeft / e.totalLife;
        }

        if (e.scalingRate) {
            e.scale += e.scalingRate * deltaT;
            e.div.style.transform = `scale(${e.scale})`;
        }

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