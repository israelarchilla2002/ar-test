AFRAME.registerComponent('hud-scale',{
    init: function() {
        const hud = this.el;
        const resize = () => {
            const aspect = window.innerWidth / window.innerHeight;

            const scale = aspect < 1 ? 0.8 : 1.1;
            hud.setAttribute('scale', `${scale} ${scale} ${scale}`);
        }
        window.addEventListener('resize', resize);
        resize();
    }
})