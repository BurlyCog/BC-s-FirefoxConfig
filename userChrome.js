(() => {
    const screen = document.getElementById("screen");

    // Character density ramp
    const CHARS = " .:-=+*#%@";

    let cols = 0;
    let rows = 0;
    let charW = 0;
    let charH = 0;

    let last = 0;

    // --- Measure character size dynamically ---
    function measureChar() {
        const span = document.createElement("span");
        span.textContent = "M";
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.fontFamily = "monospace";

        document.body.appendChild(span);
        const rect = span.getBoundingClientRect();
        document.body.removeChild(span);

        charW = rect.width;
        charH = rect.height;
    }

    // --- Compute grid based on viewport ---
    function computeGrid() {
        cols = Math.floor(window.innerWidth / charW);
        rows = Math.floor(window.innerHeight / charH);
    }

    // --- Main field generator ---
    function generate(t) {
        let output = "";

        const time = t * 0.001;

        for (let y = 0; y < rows; y++) {
            let row = "";

            for (let x = 0; x < cols; x++) {
                // Normalize coords (-1 to 1)
                const nx = (x / cols) * 2 - 1;
                const ny = (y / rows) * 2 - 1;

                // Correct aspect ratio
                const aspect = cols / rows;
                const px = nx * aspect;
                const py = ny;

                const d = Math.sqrt(px * px + py * py);

                // Swirl + wave distortion
                const angle = time * 0.8 + d * 4;
                const sx = px * Math.cos(angle) - py * Math.sin(angle);
                const sy = px * Math.sin(angle) + py * Math.cos(angle);

                const v =
                    Math.sin(8 * sx + time * 2) +
                    Math.cos(8 * sy - time * 1.5);

                const index = Math.floor(
                    ((v + 2) / 4) * (CHARS.length - 1)
                );

                row += CHARS[index];
            }

            output += row + "\n";
        }

        return output;
    }

    // --- Animation loop ---
    function loop(t) {
        requestAnimationFrame(loop);

        if (t - last < 33) return; // ~30 FPS
        last = t;

        screen.textContent = generate(t);
    }

    // --- Resize handling ---
    function init() {
        measureChar();
        computeGrid();
    }

    window.addEventListener("resize", () => {
        init();
    });

    // Initial setup
    init();
    requestAnimationFrame(loop);
})();
