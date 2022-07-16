tsParticles.load("particles-js", {
    particles: {
          number: {
                value: 70,
                density: {
                        enable: true,
                        value_area: 1100
                  } 
            },
          color: { value: '#f28a0f' },
          shape: {
                type: ["triangle", "circle"],
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 3 }
          },
          opacity: {
                value: 1,
                random: true,
                animation: {
                      enable: false,
                      speed: 0.5,
                      minimumValue: 0.4,
                      sync: false
                  }
          },
          size: {
                value: 6,
                random: true,
                animation: { 
                      enable: false,
                      speed: 2,
                      minimumValue: 0.1,
                      sync: true
                  }
          },
          lineLinked: {
                enable: true,
                distance: 30,
                color: "#f28a0f",
                opacity: 0.4,
                width: 1
          },
          move: {
                enable: true,
                speed: 1.4,
                direction: "top",
                random: true,
                straight: false,
                outMode: "out",
                bounce: false
          },
          rotate: {
                random: true,
                animation: {
                      enable: true,
                      speed: 5,
                      sync: false
                }
          }
    },
    interactivity: {
          events: {
                onHover: { enable: false },
                onClick: { enable: false },
                resize: true
          }
    },
    fpsLimit: 60,
    detectsRetina: true
});
