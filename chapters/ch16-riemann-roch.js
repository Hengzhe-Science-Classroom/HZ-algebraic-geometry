window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'The Riemann-Roch Theorem',
    subtitle: 'The master theorem of algebraic curves',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Motivation: Why Riemann-Roch?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Given a smooth projective curve \\(C\\) and a divisor \\(D\\) on it, we want to understand the vector space</p>
        \\[L(D) = H^0(C, \\mathcal{O}(D)) = \\{ f \\in k(C)^\\times \\mid \\operatorname{div}(f) + D \\geq 0 \\} \\cup \\{0\\}.\\]
        <p>This is the space of rational functions on \\(C\\) whose poles are "no worse than allowed by \\(D\\)." Its dimension \\(\\ell(D) = \\dim L(D)\\) controls nearly everything: whether the curve can be embedded in projective space, how many functions live on it, and what maps are possible.</p>
    </div>
</div>

<p>Throughout Chapters 13-15, we built the machinery of divisors, differentials, and sheaf cohomology. The Riemann-Roch theorem is where all of these threads converge into a single, powerful formula.</p>

<h3>The Dimension Problem</h3>

<p>Computing \\(\\ell(D)\\) directly is hard. Even for simple curves, one must solve systems of constraints involving pole orders at each point. Riemann's inequality gives a lower bound:</p>
\\[\\ell(D) \\geq \\deg(D) - g + 1,\\]
<p>where \\(g\\) is the genus of the curve. But this bound is not always tight. The "error term" that Roch identified is itself a dimension: it is \\(\\ell(K - D)\\), where \\(K\\) is the canonical divisor.</p>

<h3>What Riemann-Roch Does</h3>

<p>The Riemann-Roch theorem converts the problem of computing \\(\\ell(D)\\) (a global, analytic quantity) into a simple arithmetic formula involving only the degree of \\(D\\), the genus \\(g\\), and the "complementary" space \\(\\ell(K-D)\\). This is remarkable: it links algebra (linear systems), analysis (meromorphic functions), and topology (genus) in a single equation.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Bernhard Riemann proved the inequality \\(\\ell(D) \\geq \\deg D - g + 1\\) in 1857. His student Gustav Roch, in 1865, identified the exact correction term, turning the inequality into an equality. Roch died of tuberculosis at age 26, just one year after this achievement. The theorem has since been generalized enormously: to surfaces (Noether), to arbitrary dimensions (Hirzebruch), and to the most general setting of coherent sheaves on proper schemes (Grothendieck).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-riemann-roch-calculator"></div>
`,
            visualizations: [
                {
                    id: 'viz-riemann-roch-calculator',
                    title: 'Riemann-Roch Calculator',
                    description: 'Explore the Riemann-Roch formula interactively. Set the genus \\(g\\) and degree \\(\\deg(D)\\), and see how \\(\\ell(D)\\) is constrained. For non-special divisors (\\(\\ell(K-D)=0\\)), the formula gives \\(\\ell(D)\\) exactly. For special divisors, you can also adjust \\(\\ell(K-D)\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var g = 3;
                        var degD = 5;
                        var lKD = 0;

                        VizEngine.createSlider(controls, 'Genus g', 0, 10, g, 1, function(v) {
                            g = Math.round(v);
                            lKD = Math.min(lKD, Math.max(0, 2*g - 2 - degD + 1));
                            draw();
                        });
                        VizEngine.createSlider(controls, 'deg(D)', -2, 20, degD, 1, function(v) {
                            degD = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'l(K-D)', 0, 10, lKD, 1, function(v) {
                            lKD = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var lD = degD - g + 1 + lKD;
                            var degK = 2 * g - 2;
                            var chi = degD - g + 1;

                            // Title
                            viz.screenText('Riemann-Roch Theorem', viz.width / 2, 22, viz.colors.white, 16);

                            // The formula
                            viz.screenText('l(D) - l(K-D) = deg(D) - g + 1', viz.width / 2, 52, viz.colors.teal, 14);

                            // Box layout
                            var boxY = 80;
                            var boxH = 70;
                            var boxW = 130;
                            var gap = 15;
                            var totalW = 4 * boxW + 3 * gap;
                            var startX = (viz.width - totalW) / 2;

                            var boxes = [
                                { label: 'l(D)', value: Math.max(0, lD), color: viz.colors.blue },
                                { label: 'l(K-D)', value: lKD, color: viz.colors.purple },
                                { label: 'deg(D)', value: degD, color: viz.colors.orange },
                                { label: 'g', value: g, color: viz.colors.green }
                            ];

                            for (var i = 0; i < boxes.length; i++) {
                                var b = boxes[i];
                                var bx = startX + i * (boxW + gap);
                                ctx.fillStyle = b.color + '18';
                                ctx.strokeStyle = b.color + '66';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(bx, boxY, boxW, boxH, 6);
                                ctx.fill();
                                ctx.stroke();

                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = b.color;
                                ctx.textBaseline = 'top';
                                ctx.fillText(b.label, bx + boxW / 2, boxY + 8);

                                ctx.font = 'bold 24px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.textBaseline = 'middle';
                                ctx.fillText(b.value.toString(), bx + boxW / 2, boxY + boxH / 2 + 10);
                            }

                            // Verification line
                            var verY = boxY + boxH + 25;
                            var lhs = Math.max(0, lD) - lKD;
                            var rhs = chi;
                            var match = (lD >= 0) && (lhs === rhs);
                            viz.screenText(
                                'l(D) - l(K-D) = ' + Math.max(0, lD) + ' - ' + lKD + ' = ' + lhs +
                                '    |    deg(D) - g + 1 = ' + degD + ' - ' + g + ' + 1 = ' + rhs,
                                viz.width / 2, verY, match ? viz.colors.teal : viz.colors.red, 12
                            );
                            viz.screenText(
                                match ? 'Riemann-Roch verified!' : (lD < 0 ? 'l(D) cannot be negative; adjust parameters' : 'LHS != RHS; adjust l(K-D)'),
                                viz.width / 2, verY + 22, match ? viz.colors.green : viz.colors.red, 11
                            );

                            // Additional info
                            var infoY = verY + 55;
                            viz.screenText('Derived quantities:', viz.width / 2, infoY, viz.colors.text, 13);

                            var items = [
                                'deg(K) = 2g - 2 = ' + degK,
                                'Euler characteristic chi(O(D)) = deg(D) - g + 1 = ' + chi,
                                degD > degK ? 'deg(D) > 2g-2, so D is non-special: l(K-D) = 0' :
                                    (degD < 0 ? 'deg(D) < 0, so l(D) = 0' :
                                    'D may be special (0 <= deg(D) <= 2g-2)')
                            ];

                            for (var j = 0; j < items.length; j++) {
                                viz.screenText(items[j], viz.width / 2, infoY + 22 + j * 20, viz.colors.text, 11);
                            }

                            // Plot: l(D) vs deg(D) for fixed g (bottom)
                            var plotY = infoY + 90;
                            var plotH = viz.height - plotY - 15;
                            var plotX = 50;
                            var plotW = viz.width - 100;

                            if (plotH > 40) {
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(plotX, plotY + plotH);
                                ctx.lineTo(plotX + plotW, plotY + plotH);
                                ctx.stroke();

                                viz.screenText('l(D) bounds for g=' + g + ' (non-special)', viz.width / 2, plotY - 2, viz.colors.text, 10);

                                var maxDeg = Math.max(2 * g + 2, degD + 3);
                                var minDeg = -2;
                                var maxL = maxDeg - g + 2;

                                ctx.strokeStyle = viz.colors.blue + '88';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var started = false;
                                for (var d = minDeg; d <= maxDeg; d++) {
                                    var lVal = Math.max(0, d - g + 1);
                                    var px = plotX + (d - minDeg) / (maxDeg - minDeg) * plotW;
                                    var py = plotY + plotH - (lVal / maxL) * plotH;
                                    if (!started) { ctx.moveTo(px, py); started = true; }
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Mark current point
                                var curPx = plotX + (degD - minDeg) / (maxDeg - minDeg) * plotW;
                                var curLVal = Math.max(0, lD);
                                var curPy = plotY + plotH - (curLVal / maxL) * plotH;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(curPx, curPy, 5, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For a curve of genus \\(g = 0\\) (i.e., \\(\\mathbb{P}^1\\)), compute \\(\\ell(D)\\) for a divisor of degree \\(d \\geq 0\\). Why is \\(\\ell(K-D) = 0\\) when \\(d \\geq 0\\)?',
                    hint: 'On \\(\\mathbb{P}^1\\), the canonical divisor has degree \\(2g - 2 = -2\\). So \\(\\deg(K - D) = -2 - d < 0\\).',
                    solution: 'By Riemann-Roch: \\(\\ell(D) - \\ell(K-D) = d - 0 + 1 = d + 1\\). Since \\(\\deg(K-D) = -2 - d < 0\\), we have \\(\\ell(K-D) = 0\\). Thus \\(\\ell(D) = d + 1\\). For example, \\(\\ell(3P) = 4\\), giving a 4-dimensional space of rational functions with at most a triple pole at \\(P\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Theorem
        // ================================================================
        {
            id: 'sec-statement',
            title: 'The Theorem',
            content: `
<h2>The Riemann-Roch Theorem</h2>

<div class="env-block definition">
    <div class="env-title">Setup and Notation</div>
    <div class="env-body">
        <p>Let \\(C\\) be a smooth projective curve of genus \\(g\\) over an algebraically closed field \\(k\\). Let \\(K\\) denote a canonical divisor (the divisor of any nonzero rational differential \\(\\omega \\in \\Omega^1_{C/k}\\)). Recall:</p>
        <ul>
            <li>\\(\\deg(K) = 2g - 2\\).</li>
            <li>\\(\\ell(D) = \\dim_k H^0(C, \\mathcal{O}(D))\\) for any divisor \\(D\\).</li>
            <li>\\(\\ell(0) = 1\\) (the only global regular functions on a projective curve are constants).</li>
            <li>If \\(\\deg(D) < 0\\), then \\(\\ell(D) = 0\\).</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.1 (Riemann-Roch)</div>
    <div class="env-body">
        <p>For any divisor \\(D\\) on a smooth projective curve \\(C\\) of genus \\(g\\):</p>
        \\[\\ell(D) - \\ell(K - D) = \\deg(D) - g + 1.\\]
    </div>
</div>

<p>Equivalently, writing \\(h^i = \\dim H^i\\) and using Serre duality \\(H^1(C, \\mathcal{O}(D)) \\cong H^0(C, \\mathcal{O}(K-D))^\\vee\\):</p>
\\[h^0(\\mathcal{O}(D)) - h^1(\\mathcal{O}(D)) = \\deg(D) - g + 1 = \\chi(\\mathcal{O}(D)).\\]
<p>The right-hand side is the <strong>Euler characteristic</strong> of the sheaf \\(\\mathcal{O}(D)\\). The theorem says: the Euler characteristic of a line bundle on a curve depends only on the degree.</p>

<h3>Special Cases</h3>

<div class="env-block example">
    <div class="env-title">Example: \\(D = 0\\)</div>
    <div class="env-body">
        <p>Setting \\(D = 0\\): \\(\\ell(0) - \\ell(K) = 0 - g + 1\\). Since \\(\\ell(0) = 1\\), we get \\(\\ell(K) = g\\). The canonical linear system has dimension \\(g\\), confirming that the space of regular differentials on a genus-\\(g\\) curve is \\(g\\)-dimensional.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(D = K\\)</div>
    <div class="env-body">
        <p>Setting \\(D = K\\): \\(\\ell(K) - \\ell(0) = (2g-2) - g + 1 = g - 1\\). So \\(g - 1 = g - 1\\). \\(\\checkmark\\)</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Special and Non-Special Divisors)</div>
    <div class="env-body">
        <p>A divisor \\(D\\) is called <strong>special</strong> if \\(\\ell(K - D) > 0\\), equivalently \\(h^1(\\mathcal{O}(D)) > 0\\). Otherwise \\(D\\) is <strong>non-special</strong>.</p>
        <p>If \\(\\deg(D) > 2g - 2\\), then \\(\\deg(K - D) < 0\\), so \\(\\ell(K - D) = 0\\) and \\(D\\) is non-special. In this case, Riemann-Roch gives \\(\\ell(D) = \\deg(D) - g + 1\\) exactly.</p>
    </div>
</div>

<div class="env-block corollary">
    <div class="env-title">Corollary 16.2</div>
    <div class="env-body">
        <p>For any divisor \\(D\\) on a curve of genus \\(g\\):</p>
        <ol>
            <li>\\(\\ell(D) \\geq \\deg(D) - g + 1\\) (Riemann's inequality), with equality when \\(D\\) is non-special.</li>
            <li>If \\(\\deg(D) \\geq 2g - 1\\), then \\(\\ell(D) = \\deg(D) - g + 1\\).</li>
            <li>If \\(\\deg(D) \\geq 2g\\), then \\(|D|\\) is base-point-free.</li>
            <li>If \\(\\deg(D) \\geq 2g + 1\\), then \\(|D|\\) is very ample (defines an embedding).</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-characteristic-rr"></div>
`,
            visualizations: [
                {
                    id: 'viz-euler-characteristic-rr',
                    title: 'Euler Characteristic: chi(O(D)) = deg(D) - g + 1',
                    description: 'The Euler characteristic \\(\\chi(\\mathcal{O}(D)) = h^0 - h^1\\) depends only on \\(\\deg(D)\\) and \\(g\\). This visualization verifies the formula for specific examples, showing how \\(h^0\\) and \\(h^1\\) trade off while their difference stays fixed.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var g = 3;
                        VizEngine.createSlider(controls, 'Genus g', 0, 8, g, 1, function(v) {
                            g = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('h^0 and h^1 for non-special divisors on genus ' + g + ' curve', viz.width / 2, 20, viz.colors.white, 13);

                            var plotL = 60, plotR = viz.width - 30;
                            var plotT = 50, plotB = 310;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Range
                            var minD = -3, maxD = 2 * g + 4;
                            var maxH = maxD - g + 2;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotR, plotB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotL, plotT);
                            ctx.stroke();

                            viz.screenText('deg(D)', (plotL + plotR) / 2, plotB + 20, viz.colors.text, 11);

                            // Tick marks
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.text;
                            for (var d = minD; d <= maxD; d += 2) {
                                var px = plotL + (d - minD) / (maxD - minD) * plotW;
                                ctx.fillText(d.toString(), px, plotB + 4);
                            }

                            // h^0 line (non-special: max(0, d-g+1))
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var d = minD; d <= maxD; d += 0.5) {
                                var h0 = Math.max(0, d - g + 1);
                                var px = plotL + (d - minD) / (maxD - minD) * plotW;
                                var py = plotB - (h0 / maxH) * plotH;
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // h^1 line (non-special: max(0, g-1-d) using l(K-D)=max(0, (2g-2-d)-g+1)=max(0,g-1-d))
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            started = false;
                            for (var d = minD; d <= maxD; d += 0.5) {
                                var h1 = Math.max(0, g - 1 - d);
                                var px = plotL + (d - minD) / (maxD - minD) * plotW;
                                var py = plotB - (h1 / maxH) * plotH;
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // chi line
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            started = false;
                            for (var d = minD; d <= maxD; d += 0.5) {
                                var chi = d - g + 1;
                                var px = plotL + (d - minD) / (maxD - minD) * plotW;
                                var py = plotB - (chi / maxH) * plotH;
                                if (py >= plotT && py <= plotB + 20) {
                                    if (!started) { ctx.moveTo(px, py); started = true; }
                                    else ctx.lineTo(px, py);
                                } else {
                                    started = false;
                                }
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Mark special degree range
                            var specialLeft = plotL + (0 - minD) / (maxD - minD) * plotW;
                            var specialRight = plotL + (2 * g - 2 - minD) / (maxD - minD) * plotW;
                            if (g > 0) {
                                ctx.fillStyle = viz.colors.purple + '12';
                                ctx.fillRect(specialLeft, plotT, specialRight - specialLeft, plotH);
                                viz.screenText('special range', (specialLeft + specialRight) / 2, plotT + 10, viz.colors.purple, 9);
                            }

                            // Legend
                            var legY = plotB + 35;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotL, legY, 14, 3);
                            ctx.fillText('h^0 = l(D)', plotL + 20, legY + 4);

                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(plotL + 130, legY, 14, 3);
                            ctx.fillText('h^1 = l(K-D)', plotL + 155, legY + 4);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(plotL + 290, legY, 14, 3);
                            ctx.fillText('chi = h^0 - h^1', plotL + 310, legY + 4);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(C\\) be a curve of genus 2 and \\(D\\) a divisor of degree 3. What are the possible values of \\(\\ell(D)\\)?',
                    hint: 'By Riemann-Roch, \\(\\ell(D) = 3 - 2 + 1 + \\ell(K-D) = 2 + \\ell(K-D)\\). Since \\(\\deg(K-D) = 2 - 3 = -1 < 0\\), what is \\(\\ell(K-D)\\)?',
                    solution: '\\(\\deg(K-D) = (2\\cdot 2 - 2) - 3 = -1 < 0\\), so \\(\\ell(K-D) = 0\\). Thus \\(\\ell(D) = 3 - 2 + 1 = 2\\). There is no ambiguity: every degree 3 divisor on a genus 2 curve is non-special.'
                },
                {
                    question: 'Show that \\(\\ell(K) = g\\) using Riemann-Roch.',
                    hint: 'Set \\(D = K\\) in the theorem. What is \\(\\ell(K - K) = \\ell(0)\\)?',
                    solution: 'Riemann-Roch with \\(D = K\\): \\(\\ell(K) - \\ell(0) = \\deg(K) - g + 1 = (2g-2) - g + 1 = g - 1\\). Since \\(\\ell(0) = 1\\), we get \\(\\ell(K) = g\\). This confirms that the space of holomorphic differentials on a genus-\\(g\\) curve has dimension \\(g\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Proof Sketch
        // ================================================================
        {
            id: 'sec-proof',
            title: 'Proof Sketch',
            content: `
<h2>Proof Sketch</h2>

<div class="env-block intuition">
    <div class="env-title">The Architecture of the Proof</div>
    <div class="env-body">
        <p>The modern proof uses two key ingredients from cohomology: (1) the long exact sequence in cohomology, which lets us track how \\(\\ell(D)\\) changes when we add a single point to \\(D\\); and (2) Serre duality, which identifies the mysterious correction term \\(h^1(\\mathcal{O}(D))\\) with the concrete space \\(h^0(\\mathcal{O}(K-D)) = \\ell(K-D)\\).</p>
    </div>
</div>

<h3>Step 1: Serre Duality</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.3 (Serre Duality for Curves)</div>
    <div class="env-body">
        <p>For a smooth projective curve \\(C\\) of genus \\(g\\) and any divisor \\(D\\):</p>
        \\[H^1(C, \\mathcal{O}(D)) \\cong H^0(C, \\Omega^1_C(-D))^\\vee \\cong H^0(C, \\mathcal{O}(K-D))^\\vee.\\]
        <p>In particular, \\(h^1(\\mathcal{O}(D)) = \\ell(K - D)\\).</p>
    </div>
</div>

<p>Serre duality is the deep result. Once we accept it, the Riemann-Roch formula becomes \\(\\ell(D) - \\ell(K-D) = \\chi(\\mathcal{O}(D))\\), and we need only compute the Euler characteristic.</p>

<h3>Step 2: The Euler Characteristic is Additive</h3>

<p>Given a point \\(P \\in C\\), consider the short exact sequence of sheaves:</p>
\\[0 \\to \\mathcal{O}(D) \\to \\mathcal{O}(D + P) \\to \\mathcal{O}(D+P)|_P \\to 0.\\]
<p>The quotient sheaf \\(\\mathcal{O}(D+P)|_P\\) is a skyscraper sheaf at \\(P\\) with stalk \\(k\\). The long exact sequence in cohomology gives:</p>
\\[0 \\to H^0(\\mathcal{O}(D)) \\to H^0(\\mathcal{O}(D+P)) \\to k \\to H^1(\\mathcal{O}(D)) \\to H^1(\\mathcal{O}(D+P)) \\to 0.\\]

<p>The alternating sum of dimensions in any exact sequence is zero, so:</p>
\\[\\chi(\\mathcal{O}(D+P)) = \\chi(\\mathcal{O}(D)) + \\chi(k_P) = \\chi(\\mathcal{O}(D)) + 1.\\]

<div class="env-block lemma">
    <div class="env-title">Lemma 16.4</div>
    <div class="env-body">
        <p>\\(\\chi(\\mathcal{O}(D))\\) is a linear function of \\(\\deg(D)\\): specifically, \\(\\chi(\\mathcal{O}(D)) = \\deg(D) + \\chi(\\mathcal{O})\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of Lemma</div>
    <div class="env-body">
        <p>Adding a point increases degree by 1 and \\(\\chi\\) by 1, so \\(\\chi(\\mathcal{O}(D)) - \\chi(\\mathcal{O}) = \\deg(D)\\). Any divisor can be reached from 0 by adding/subtracting points.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Step 3: Computing \\(\\chi(\\mathcal{O})\\)</h3>

<p>Setting \\(D = 0\\): \\(\\chi(\\mathcal{O}) = h^0(\\mathcal{O}) - h^1(\\mathcal{O}) = 1 - g\\). This uses \\(h^0(\\mathcal{O}) = 1\\) (only constants are global sections) and \\(h^1(\\mathcal{O}) = h^0(\\Omega^1) = g\\) (by Serre duality and the definition of genus).</p>

<h3>Putting It Together</h3>

<div class="env-block proof">
    <div class="env-title">Proof of Riemann-Roch</div>
    <div class="env-body">
        <p>Combining Steps 1-3:</p>
        \\[\\ell(D) - \\ell(K-D) = h^0(\\mathcal{O}(D)) - h^1(\\mathcal{O}(D)) = \\chi(\\mathcal{O}(D)) = \\deg(D) + \\chi(\\mathcal{O}) = \\deg(D) - g + 1.\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">What the Proof Reveals</div>
    <div class="env-body">
        <p>The proof shows that Riemann-Roch is really two theorems fused together: (1) the Euler characteristic is topological (depends only on degree and genus); (2) Serre duality interprets the "error term" \\(h^1\\) geometrically as \\(\\ell(K-D)\\). Without Serre duality, we would still know \\(\\chi(\\mathcal{O}(D)) = \\deg D - g + 1\\), but the formula would involve the abstract \\(h^1\\) rather than the computable \\(\\ell(K-D)\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Fill in the details of Step 2: starting from the short exact sequence, write out the long exact sequence in cohomology and verify that \\(\\chi(\\mathcal{O}(D+P)) = \\chi(\\mathcal{O}(D)) + 1\\).',
                    hint: 'The alternating sum of dimensions in a long exact sequence of finite-dimensional vector spaces is zero.',
                    solution: 'From \\(0 \\to \\mathcal{O}(D) \\to \\mathcal{O}(D+P) \\to k_P \\to 0\\), the LES is \\(0 \\to H^0(\\mathcal{O}(D)) \\to H^0(\\mathcal{O}(D+P)) \\to k \\to H^1(\\mathcal{O}(D)) \\to H^1(\\mathcal{O}(D+P)) \\to 0\\) (using \\(H^1(k_P) = 0\\) for a skyscraper). The alternating sum: \\(h^0(D) - h^0(D+P) + 1 - h^1(D) + h^1(D+P) = 0\\). Rearranging: \\((h^0(D+P) - h^1(D+P)) = (h^0(D) - h^1(D)) + 1\\), i.e., \\(\\chi(D+P) = \\chi(D) + 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications of Riemann-Roch</h2>

<div class="env-block intuition">
    <div class="env-title">The Power of Dimension Counting</div>
    <div class="env-body">
        <p>Riemann-Roch is the workhorse theorem for algebraic curves. It answers questions like: Can this curve be embedded in \\(\\mathbb{P}^n\\)? How many independent functions have prescribed poles? What does a curve of genus \\(g\\) "look like"? We survey the major applications.</p>
    </div>
</div>

<h3>Application 1: Embedding Curves in Projective Space</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.5 (Embedding Theorem)</div>
    <div class="env-body">
        <p>If \\(D\\) is a divisor on a smooth curve \\(C\\) of genus \\(g\\) with \\(\\deg(D) \\geq 2g + 1\\), then the complete linear system \\(|D|\\) defines a closed embedding \\(C \\hookrightarrow \\mathbb{P}^{\\ell(D)-1}\\).</p>
    </div>
</div>

<p>This follows because, by Corollary 16.2(4), \\(|D|\\) is very ample when \\(\\deg(D) \\geq 2g+1\\). The map sends \\(P \\mapsto [f_0(P) : \\cdots : f_n(P)]\\), where \\(\\{f_0, \\ldots, f_n\\}\\) is a basis for \\(L(D)\\).</p>

<h3>Application 2: Classification of Low-Genus Curves</h3>

<p>Riemann-Roch completely determines the geometry of curves of small genus.</p>

<div class="env-block example">
    <div class="env-title">Genus 0: The Projective Line</div>
    <div class="env-body">
        <p>If \\(g = 0\\), pick any point \\(P\\). Then \\(\\ell(P) = 1 - 0 + 1 = 2\\). So \\(L(P)\\) contains a non-constant function \\(f\\) with a simple pole at \\(P\\) and no other poles. This \\(f\\) defines an isomorphism \\(C \\xrightarrow{\\sim} \\mathbb{P}^1\\). Conclusion: every smooth genus 0 curve (with a rational point) is isomorphic to \\(\\mathbb{P}^1\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Genus 1: Elliptic Curves</div>
    <div class="env-body">
        <p>If \\(g = 1\\), the canonical divisor has degree \\(2g - 2 = 0\\) and \\(\\ell(K) = 1\\), so \\(K \\sim 0\\). For a divisor \\(D\\) of degree \\(d \\geq 1\\): \\(\\ell(D) = d\\) (non-special since \\(d \\geq 1 = 2g - 1\\)). Taking \\(D = 3P\\): \\(\\ell(3P) = 3\\), giving an embedding \\(C \\hookrightarrow \\mathbb{P}^2\\) as a plane cubic. This is the Weierstrass model of an elliptic curve.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Genus 2: Hyperelliptic Curves</div>
    <div class="env-body">
        <p>If \\(g = 2\\), then \\(\\ell(K) = 2\\) and \\(\\deg(K) = 2\\). The canonical linear system \\(|K|\\) gives a degree 2 map \\(C \\to \\mathbb{P}^1\\). So every genus 2 curve is hyperelliptic: it is a double cover of \\(\\mathbb{P}^1\\), branched at \\(2g + 2 = 6\\) points. In affine form: \\(y^2 = f(x)\\) where \\(\\deg f = 5\\) or \\(6\\).</p>
    </div>
</div>

<h3>Application 3: The Canonical Map</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.6 (Canonical Embedding)</div>
    <div class="env-body">
        <p>If \\(C\\) is a non-hyperelliptic curve of genus \\(g \\geq 3\\), the canonical linear system \\(|K|\\) defines an embedding \\(C \\hookrightarrow \\mathbb{P}^{g-1}\\). The image is called the <strong>canonical curve</strong> and has degree \\(2g - 2\\).</p>
    </div>
</div>

<p>For hyperelliptic curves, \\(|K|\\) is not very ample (it factors through the \\(2:1\\) map to \\(\\mathbb{P}^1\\)). For non-hyperelliptic curves of genus \\(\\geq 3\\), the canonical map is an embedding, and the study of canonical curves is central to the theory of algebraic curves.</p>

<div class="viz-placeholder" data-viz="viz-low-genus"></div>
<div class="viz-placeholder" data-viz="viz-canonical-embedding"></div>
`,
            visualizations: [
                {
                    id: 'viz-low-genus',
                    title: 'Low-Genus Curves: Classification',
                    description: 'How Riemann-Roch determines the geometry of curves with small genus. Genus 0 curves are rational, genus 1 are elliptic, genus 2 are hyperelliptic.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var genus = 0;
                        VizEngine.createSlider(controls, 'Genus', 0, 2, 0, 1, function(v) {
                            genus = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            if (genus === 0) {
                                viz.screenText('Genus 0: The Projective Line', W / 2, 25, viz.colors.white, 16);
                                viz.screenText('l(P) = 2: a non-constant function with one simple pole', W / 2, 50, viz.colors.teal, 12);
                                viz.screenText('C is isomorphic to P^1', W / 2, 70, viz.colors.text, 12);

                                // Draw P^1 as a circle (Riemann sphere)
                                var cx = W / 2, cy = 200, r = 80;
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                                ctx.stroke();

                                // Equator
                                ctx.strokeStyle = viz.colors.blue + '44';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
                                ctx.stroke();

                                // North pole
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(cx, cy - r, 5, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('inf', cx + 12, cy - r, viz.colors.orange, 11);

                                // South pole
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(cx, cy + r, 5, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('0', cx + 12, cy + r, viz.colors.teal, 11);

                                // Table
                                var tY = 310;
                                viz.screenText('deg(K) = -2,  l(K) = 0,  l(nP) = n+1 for n >= 0', W / 2, tY, viz.colors.text, 11);
                                viz.screenText('Every degree d >= 1 divisor is non-special', W / 2, tY + 18, viz.colors.text, 11);
                            }
                            else if (genus === 1) {
                                viz.screenText('Genus 1: Elliptic Curves', W / 2, 25, viz.colors.white, 16);
                                viz.screenText('l(3P) = 3: embeds C as a cubic in P^2', W / 2, 50, viz.colors.teal, 12);

                                // Draw an elliptic curve (y^2 = x^3 - x + 1)
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                var started = false;
                                for (var t = -1.3; t <= 2.0; t += 0.01) {
                                    var yy2 = t * t * t - t + 1;
                                    if (yy2 < 0) { started = false; continue; }
                                    var py = Math.sqrt(yy2);
                                    var px = W / 2 + t * 60;
                                    var screenY = 200 - py * 40;
                                    if (!started) { ctx.moveTo(px, screenY); started = true; }
                                    else ctx.lineTo(px, screenY);
                                }
                                ctx.stroke();

                                // Lower branch
                                ctx.beginPath();
                                started = false;
                                for (var t = -1.3; t <= 2.0; t += 0.01) {
                                    var yy2 = t * t * t - t + 1;
                                    if (yy2 < 0) { started = false; continue; }
                                    var py = -Math.sqrt(yy2);
                                    var px = W / 2 + t * 60;
                                    var screenY = 200 - py * 40;
                                    if (!started) { ctx.moveTo(px, screenY); started = true; }
                                    else ctx.lineTo(px, screenY);
                                }
                                ctx.stroke();

                                // Identity point
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(W / 2 + 0.5 * 60, 200 - Math.sqrt(0.625) * 40, 5, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('P', W / 2 + 0.5 * 60 + 10, 200 - Math.sqrt(0.625) * 40, viz.colors.orange, 11);

                                var tY = 320;
                                viz.screenText('deg(K) = 0,  K ~ 0,  l(K) = 1', W / 2, tY, viz.colors.text, 11);
                                viz.screenText('y^2 = x^3 + ax + b (Weierstrass form)', W / 2, tY + 18, viz.colors.text, 11);
                            }
                            else {
                                viz.screenText('Genus 2: Hyperelliptic Curves', W / 2, 25, viz.colors.white, 16);
                                viz.screenText('|K| gives a 2:1 map to P^1 (always hyperelliptic)', W / 2, 50, viz.colors.teal, 12);

                                // Draw a genus 2 curve schematically (two-holed torus cross section)
                                // as a hyperelliptic curve y^2 = (x^2-1)(x^2-4)(x^2-9)
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.lineWidth = 2.5;
                                var poly = function(x) {
                                    return (x*x - 0.5)*(x*x - 2)*(x*x - 4.5);
                                };

                                ctx.beginPath();
                                started = false;
                                for (var t = -2.2; t <= 2.2; t += 0.005) {
                                    var val = poly(t);
                                    if (val < 0) { started = false; continue; }
                                    var py = Math.sqrt(val);
                                    var px = W / 2 + t * 80;
                                    var screenY = 200 - py * 25;
                                    if (screenY < 80 || screenY > 320) { started = false; continue; }
                                    if (!started) { ctx.moveTo(px, screenY); started = true; }
                                    else ctx.lineTo(px, screenY);
                                }
                                ctx.stroke();

                                ctx.beginPath();
                                started = false;
                                for (var t = -2.2; t <= 2.2; t += 0.005) {
                                    var val = poly(t);
                                    if (val < 0) { started = false; continue; }
                                    var py = -Math.sqrt(val);
                                    var px = W / 2 + t * 80;
                                    var screenY = 200 - py * 25;
                                    if (screenY < 80 || screenY > 320) { started = false; continue; }
                                    if (!started) { ctx.moveTo(px, screenY); started = true; }
                                    else ctx.lineTo(px, screenY);
                                }
                                ctx.stroke();

                                // Branch points
                                var roots = [-2.121, -1.414, -0.707, 0.707, 1.414, 2.121];
                                for (var i = 0; i < roots.length; i++) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath();
                                    ctx.arc(W / 2 + roots[i] * 80, 200, 4, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                var tY = 310;
                                viz.screenText('deg(K) = 2, l(K) = 2: canonical map is 2:1 to P^1', W / 2, tY, viz.colors.text, 11);
                                viz.screenText('y^2 = f(x), deg(f) = 5 or 6, branched at 6 points (orange)', W / 2, tY + 18, viz.colors.text, 11);
                                viz.screenText('Every genus 2 curve is hyperelliptic', W / 2, tY + 36, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-canonical-embedding',
                    title: 'The Canonical Map',
                    description: 'For a non-hyperelliptic curve of genus \\(g \\geq 3\\), the canonical divisor \\(K\\) (with \\(\\ell(K) = g\\)) defines an embedding \\(C \\hookrightarrow \\mathbb{P}^{g-1}\\). The canonical curve has degree \\(2g-2\\). For hyperelliptic curves, the canonical map factors through a 2:1 cover of a rational normal curve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var g = 3;
                        VizEngine.createSlider(controls, 'Genus g', 2, 7, g, 1, function(v) {
                            g = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            var degK = 2 * g - 2;
                            var dimPg = g - 1;

                            viz.screenText('Canonical Map for Genus ' + g, W / 2, 22, viz.colors.white, 15);

                            // Source: abstract curve
                            var srcX = 100, srcY = 160;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;

                            // Draw a stylized curve with g holes
                            ctx.beginPath();
                            var curveW = 100;
                            var curveH = 40;
                            // Simple oval
                            ctx.ellipse(srcX, srcY, curveW / 2, curveH, 0, 0, Math.PI * 2);
                            ctx.stroke();

                            // Draw holes (genus indicators)
                            var holeSpacing = curveW / (g + 1);
                            for (var i = 0; i < g; i++) {
                                var hx = srcX - curveW / 2 + (i + 1) * holeSpacing;
                                ctx.strokeStyle = viz.colors.bg;
                                ctx.lineWidth = 4;
                                ctx.beginPath();
                                ctx.ellipse(hx, srcY, 6, 4, 0, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.strokeStyle = viz.colors.purple + '88';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.ellipse(hx, srcY, 6, 4, 0, 0, Math.PI * 2);
                                ctx.stroke();
                            }

                            viz.screenText('C (genus ' + g + ')', srcX, srcY + 55, viz.colors.blue, 11);

                            // Arrow
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(170, srcY);
                            ctx.lineTo(270, srcY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(270, srcY);
                            ctx.lineTo(260, srcY - 6);
                            ctx.lineTo(260, srcY + 6);
                            ctx.closePath();
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fill();

                            viz.screenText('|K|', 220, srcY - 15, viz.colors.teal, 12);

                            // Target: projective space
                            var tgtX = 400, tgtY = srcY;

                            if (g === 2) {
                                // Hyperelliptic: 2:1 to P^1
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(tgtX - 60, tgtY);
                                ctx.lineTo(tgtX + 60, tgtY);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(tgtX - 60, tgtY, 4, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.beginPath();
                                ctx.arc(tgtX + 60, tgtY, 4, 0, Math.PI * 2);
                                ctx.fill();

                                viz.screenText('P^1 (2:1 map, not embedding)', tgtX, tgtY + 55, viz.colors.orange, 11);
                                viz.screenText('Genus 2 is always hyperelliptic', W / 2, tgtY + 90, viz.colors.yellow, 12);
                            } else {
                                // Non-hyperelliptic: embedding in P^{g-1}
                                // Draw a stylized curve in projective space
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                for (var t = 0; t <= Math.PI * 2; t += 0.02) {
                                    var px = tgtX + 60 * Math.cos(t) + 15 * Math.cos(3 * t);
                                    var py = tgtY + 35 * Math.sin(t) + 10 * Math.sin(2 * t);
                                    if (t === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.closePath();
                                ctx.stroke();

                                viz.screenText('Canonical curve in P^' + dimPg, tgtX, tgtY + 55, viz.colors.orange, 11);
                                viz.screenText('deg = ' + degK + ', embedded (non-hyperelliptic)', tgtX, tgtY + 72, viz.colors.text, 10);
                            }

                            // Table of facts
                            var tableY = 260;
                            var rows = [
                                ['Quantity', 'Value'],
                                ['deg(K)', degK.toString()],
                                ['l(K) = g', g.toString()],
                                ['Target space', 'P^' + dimPg],
                                ['Very ample?', (g >= 3 ? 'Yes (non-hyp.)' : (g === 2 ? 'No' : 'N/A'))],
                            ];

                            var colW = 120;
                            var rowH = 20;
                            var tableX = W / 2 - colW;

                            for (var r = 0; r < rows.length; r++) {
                                for (var c = 0; c < 2; c++) {
                                    var tx = tableX + c * colW + colW / 2;
                                    var ty = tableY + r * rowH;
                                    ctx.font = (r === 0 ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = r === 0 ? viz.colors.white : viz.colors.text;
                                    ctx.fillText(rows[r][c], tx, ty);
                                }
                                if (r === 0) {
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(tableX, tableY + 10);
                                    ctx.lineTo(tableX + 2 * colW, tableY + 10);
                                    ctx.stroke();
                                }
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(C\\) be a smooth curve of genus 3, and let \\(P \\in C\\). Compute \\(\\ell(nP)\\) for \\(n = 0, 1, 2, 3, 4, 5\\).',
                    hint: 'Use Riemann-Roch: \\(\\ell(nP) = n - 3 + 1 + \\ell(K - nP) = n - 2 + \\ell(K - nP)\\). When is \\(\\ell(K - nP) > 0\\)?',
                    solution: '\\(\\deg(K) = 4\\). For \\(n = 0\\): \\(\\ell(0) = 1\\). For \\(n = 1\\): \\(\\ell(P) = -1 + \\ell(K-P)\\); since \\(\\deg(K-P)=3 > 2g-2=4\\)... wait, \\(\\deg(K-P) = 3\\) and \\(2g-2 = 4\\), so \\(K-P\\) could be special. If \\(C\\) is non-hyperelliptic, \\(\\ell(K-P) = \\ell(K) - 1 = 2\\) (generically), giving \\(\\ell(P) = 1\\). For \\(n=2\\): \\(\\ell(2P) = 0 + \\ell(K-2P)\\). \\(\\deg(K-2P) = 2\\), \\(\\ell(K-2P) \\leq 2\\); typically \\(\\ell(2P) = 1\\) (non-hyperelliptic). For \\(n=3\\): \\(\\ell(3P) = 1 + \\ell(K-3P)\\), \\(\\deg(K-3P) = 1\\), \\(\\ell(K-3P) \\leq 1\\); typically \\(\\ell(3P) = 2\\). For \\(n=4\\): \\(\\ell(4P) = 2 + \\ell(K-4P)\\), \\(\\deg(K-4P) = 0\\) so \\(\\ell(K-4P) \\leq 1\\); typically \\(\\ell(4P) = 2\\) or 3. For \\(n = 5\\): non-special, \\(\\ell(5P) = 5 - 2 = 3\\).'
                },
                {
                    question: 'Prove that a smooth plane quartic (degree 4 curve in \\(\\mathbb{P}^2\\)) has genus 3 and is canonically embedded.',
                    hint: 'Use the genus formula \\(g = (d-1)(d-2)/2\\) for a smooth plane curve of degree \\(d\\). For the canonical embedding, show that \\(K\\) is cut out by lines.',
                    solution: 'For a smooth plane curve of degree \\(d\\), \\(g = (d-1)(d-2)/2 = 3 \\cdot 2 / 2 = 3\\). The canonical divisor is \\(K = (d-3)H|_C = H|_C\\), where \\(H\\) is a hyperplane (line) class. So \\(|K|\\) is the linear system of lines in \\(\\mathbb{P}^2\\) restricted to \\(C\\), which is the identity embedding \\(C \\hookrightarrow \\mathbb{P}^2 = \\mathbb{P}^{g-1}\\). The quartic is its own canonical model.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Clifford's Theorem
        // ================================================================
        {
            id: 'sec-clifford',
            title: "Clifford's Theorem",
            content: `
<h2>Clifford's Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">Bounding Special Divisors</div>
    <div class="env-body">
        <p>Riemann-Roch tells us that \\(\\ell(D) = \\deg(D) - g + 1 + \\ell(K-D)\\). For non-special divisors (\\(\\ell(K-D) = 0\\)), this pins down \\(\\ell(D)\\) exactly. But for special divisors, \\(\\ell(D)\\) can be larger than \\(\\deg(D) - g + 1\\). How much larger can it be? Clifford's theorem gives the answer: not too much.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.7 (Clifford's Theorem)</div>
    <div class="env-body">
        <p>Let \\(D\\) be an effective special divisor on a smooth projective curve \\(C\\) of genus \\(g \\geq 1\\) (i.e., \\(D \\geq 0\\) and \\(\\ell(K-D) > 0\\)). Then</p>
        \\[\\ell(D) \\leq \\frac{\\deg(D)}{2} + 1.\\]
        <p>Equality holds if and only if \\(D = 0\\), \\(D = K\\), or \\(C\\) is hyperelliptic and \\(D\\) is a multiple of the \\(g^1_2\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>The key step uses the <strong>Clifford inequality</strong> for the tensor product of line bundles. If \\(D\\) and \\(K - D\\) are both effective, one shows:</p>
        \\[\\ell(D) \\cdot \\ell(K-D) \\leq \\ell(K) = g.\\]
        <p>This can be proved by considering the multiplication map \\(H^0(D) \\otimes H^0(K-D) \\to H^0(K)\\) and showing it is injective (or at least that the image has the right dimension). Combined with Riemann-Roch, this gives Clifford's bound.</p>
        <p>Alternatively, note that Riemann-Roch gives \\(\\ell(D) = \\deg(D) - g + 1 + \\ell(K-D)\\). Since \\(\\ell(K-D) \\leq \\deg(K-D)/2 + 1 = (2g - 2 - \\deg D)/2 + 1 = g - \\deg(D)/2\\) (by induction or the multiplication map argument), we get \\(\\ell(D) \\leq \\deg(D)/2 + 1\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Geometric Meaning</h3>

<p>Clifford's theorem says that special divisors cannot have "too many" sections relative to their degree. Geometrically, if a curve admits a map to projective space of degree \\(d\\) with image of dimension \\(r\\), then \\(r \\leq d/2\\) (when the corresponding divisor is special). This constrains the possible linear systems on curves.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Clifford Index)</div>
    <div class="env-body">
        <p>The <strong>Clifford index</strong> of a curve \\(C\\) is</p>
        \\[\\operatorname{Cliff}(C) = \\min \\{ \\deg(D) - 2(\\ell(D) - 1) \\mid D \\text{ special, effective, } \\ell(D) \\geq 2 \\}.\\]
        <p>Clifford's theorem says \\(\\operatorname{Cliff}(C) \\geq 0\\), with equality iff \\(C\\) is hyperelliptic.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-clifford-bound"></div>
`,
            visualizations: [
                {
                    id: 'viz-clifford-bound',
                    title: "Clifford's Bound: l(D) vs deg(D)",
                    description: 'The Clifford line \\(\\ell(D) = \\deg(D)/2 + 1\\) bounds special divisors from above. Non-special divisors follow the line \\(\\ell(D) = \\deg(D) - g + 1\\). The shaded region is the "allowed zone" for special divisors.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var g = 4;
                        VizEngine.createSlider(controls, 'Genus g', 2, 10, g, 1, function(v) {
                            g = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText("Clifford's Theorem for genus " + g, W / 2, 20, viz.colors.white, 14);

                            var plotL = 65, plotR = W - 30;
                            var plotT = 50, plotB = 340;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            var maxDeg = 2 * g + 2;
                            var maxL = g + 2;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotR, plotB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotL, plotT);
                            ctx.stroke();

                            viz.screenText('deg(D)', (plotL + plotR) / 2, plotB + 20, viz.colors.text, 11);
                            viz.screenText('l(D)', plotL - 20, (plotT + plotB) / 2, viz.colors.text, 11);

                            // Ticks
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.text;
                            for (var d = 0; d <= maxDeg; d += 2) {
                                var px = plotL + d / maxDeg * plotW;
                                ctx.fillText(d.toString(), px, plotB + 4);
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var l = 0; l <= maxL; l += 2) {
                                var py = plotB - l / maxL * plotH;
                                ctx.fillText(l.toString(), plotL - 8, py);
                            }

                            // Mark 2g-2
                            var px2g2 = plotL + (2 * g - 2) / maxDeg * plotW;
                            ctx.strokeStyle = viz.colors.purple + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(px2g2, plotT);
                            ctx.lineTo(px2g2, plotB);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('2g-2', px2g2, plotT - 10, viz.colors.purple, 9);

                            // Shade the "allowed zone" for special divisors
                            // Between RR line (bottom) and Clifford line (top)
                            ctx.fillStyle = viz.colors.teal + '15';
                            ctx.beginPath();
                            // RR line from d=g-1 to d=2g-2
                            var dStart = Math.max(0, g - 1);
                            for (var d = 0; d <= 2 * g - 2; d += 0.5) {
                                var rrL = Math.max(0, d - g + 1);
                                var px = plotL + d / maxDeg * plotW;
                                var py = plotB - rrL / maxL * plotH;
                                if (d === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            // Clifford line back
                            for (var d = 2 * g - 2; d >= 0; d -= 0.5) {
                                var clL = Math.min(d / 2 + 1, g);
                                var px = plotL + d / maxDeg * plotW;
                                var py = plotB - clL / maxL * plotH;
                                ctx.lineTo(px, py);
                            }
                            ctx.closePath();
                            ctx.fill();

                            // RR line (non-special): l(D) = max(0, d - g + 1)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var d = 0; d <= maxDeg; d += 0.5) {
                                var lVal = Math.max(0, d - g + 1);
                                var px = plotL + d / maxDeg * plotW;
                                var py = plotB - lVal / maxL * plotH;
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Clifford line: l(D) = d/2 + 1 (for 0 <= d <= 2g-2)
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 3]);
                            ctx.beginPath();
                            started = false;
                            for (var d = 0; d <= 2 * g - 2; d += 0.5) {
                                var lVal = d / 2 + 1;
                                var px = plotL + d / maxDeg * plotW;
                                var py = plotB - lVal / maxL * plotH;
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Special points
                            // D=0: l=1
                            var px0 = plotL, py0 = plotB - 1 / maxL * plotH;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(px0, py0, 5, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('D=0', px0 + 8, py0 - 10, viz.colors.orange, 9);

                            // D=K: l=g
                            var pxK = plotL + (2 * g - 2) / maxDeg * plotW;
                            var pyK = plotB - g / maxL * plotH;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(pxK, pyK, 5, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('D=K', pxK + 8, pyK - 10, viz.colors.orange, 9);

                            // Legend
                            var legY = plotB + 35;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotL, legY, 14, 3);
                            ctx.fillText('RR (non-special)', plotL + 20, legY + 4);

                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(plotL + 160, legY, 14, 3);
                            ctx.fillText('Clifford bound', plotL + 180, legY + 4);

                            ctx.fillStyle = viz.colors.teal + '44';
                            ctx.fillRect(plotL + 300, legY - 3, 14, 10);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Special divisor zone', plotL + 320, legY + 4);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Show that Clifford's theorem implies that a curve of genus \\(g\\) cannot have a \\(g^1_1\\) unless \\(g = 0\\). (A \\(g^r_d\\) is a linear system of dimension \\(r\\) and degree \\(d\\).)",
                    hint: 'A \\(g^1_1\\) means \\(\\ell(D) \\geq 2\\) and \\(\\deg(D) = 1\\). Apply Clifford.',
                    solution: 'If \\(D\\) is special with \\(\\deg(D) = 1\\) and \\(\\ell(D) \\geq 2\\), Clifford gives \\(2 \\leq \\ell(D) \\leq 1/2 + 1 = 3/2\\), a contradiction. If \\(D\\) is non-special, \\(\\ell(D) = 1 - g + 1 = 2 - g\\), which requires \\(g = 0\\) for \\(\\ell(D) \\geq 2\\). So a \\(g^1_1\\) exists only for \\(g = 0\\), where it is the identity map \\(\\mathbb{P}^1 \\to \\mathbb{P}^1\\).'
                },
                {
                    question: 'A curve \\(C\\) has a \\(g^1_2\\) (a degree 2 map to \\(\\mathbb{P}^1\\)). Show that \\(C\\) is hyperelliptic and that the \\(g^1_2\\) achieves equality in Clifford\'s theorem.',
                    hint: 'A \\(g^1_2\\) means there exists \\(D\\) with \\(\\deg(D) = 2\\) and \\(\\ell(D) \\geq 2\\). Check Clifford.',
                    solution: 'We have \\(\\deg(D) = 2\\), \\(\\ell(D) \\geq 2\\). Clifford gives \\(\\ell(D) \\leq 2/2 + 1 = 2\\), so \\(\\ell(D) = 2\\) exactly. Equality in Clifford holds, which by the characterization means \\(C\\) is hyperelliptic (or \\(D = 0\\) or \\(D = K\\), but \\(\\deg D = 2 \\neq 0\\) rules out \\(D=0\\), and \\(D = K\\) would require \\(g = 2\\), consistent with hyperellipticity). The \\(g^1_2\\) defining the 2:1 map to \\(\\mathbb{P}^1\\) is the hallmark of hyperelliptic curves.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Higher Dimensions (Hirzebruch-Riemann-Roch)
        // ================================================================
        {
            id: 'sec-hirzebruch',
            title: 'Higher Dimensions',
            content: `
<h2>Riemann-Roch in Higher Dimensions</h2>

<div class="env-block intuition">
    <div class="env-title">From Curves to Varieties</div>
    <div class="env-body">
        <p>The Riemann-Roch theorem for curves is beautiful, but algebraic geometry does not stop at dimension 1. On surfaces (dimension 2), threefolds (dimension 3), and higher, analogous theorems exist. The full generalization, the Hirzebruch-Riemann-Roch theorem, expresses the Euler characteristic of a vector bundle in terms of characteristic classes. The Grothendieck-Riemann-Roch theorem goes further still, relating push-forwards of sheaves across morphisms.</p>
    </div>
</div>

<h3>Surfaces: The Noether Formula</h3>

<p>For a smooth projective surface \\(S\\), the analogue of Riemann-Roch for a line bundle \\(\\mathcal{L}\\) is:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.8 (Riemann-Roch for Surfaces)</div>
    <div class="env-body">
        \\[\\chi(S, \\mathcal{L}) = \\frac{1}{2}\\mathcal{L} \\cdot (\\mathcal{L} - K_S) + \\chi(\\mathcal{O}_S),\\]
        <p>where \\(\\cdot\\) denotes the intersection pairing, \\(K_S\\) is the canonical class, and \\(\\chi(\\mathcal{O}_S) = 1 - q + p_g\\) with \\(q = h^1(\\mathcal{O}_S)\\) the irregularity and \\(p_g = h^2(\\mathcal{O}_S)\\) the geometric genus.</p>
    </div>
</div>

<p>When \\(\\mathcal{L} = \\mathcal{O}_S\\), this gives the <strong>Noether formula</strong>: \\(\\chi(\\mathcal{O}_S) = \\frac{1}{12}(K_S^2 + e(S))\\), where \\(e(S)\\) is the topological Euler characteristic.</p>

<h3>The Hirzebruch-Riemann-Roch Theorem</h3>

<p>For a smooth projective variety \\(X\\) of dimension \\(n\\) and a vector bundle \\(\\mathcal{E}\\):</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.9 (Hirzebruch-Riemann-Roch)</div>
    <div class="env-body">
        \\[\\chi(X, \\mathcal{E}) = \\int_X \\operatorname{ch}(\\mathcal{E}) \\cdot \\operatorname{td}(T_X),\\]
        <p>where \\(\\operatorname{ch}(\\mathcal{E})\\) is the <strong>Chern character</strong> and \\(\\operatorname{td}(T_X)\\) is the <strong>Todd class</strong> of the tangent bundle.</p>
    </div>
</div>

<h3>Chern Character and Todd Class</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>For a vector bundle \\(\\mathcal{E}\\) with Chern classes \\(c_1, c_2, \\ldots\\):</p>
        <ul>
            <li><strong>Chern character:</strong> \\(\\operatorname{ch}(\\mathcal{E}) = \\operatorname{rk}(\\mathcal{E}) + c_1 + \\frac{1}{2}(c_1^2 - 2c_2) + \\cdots\\)</li>
            <li><strong>Todd class:</strong> \\(\\operatorname{td}(\\mathcal{E}) = 1 + \\frac{1}{2}c_1 + \\frac{1}{12}(c_1^2 + c_2) + \\frac{1}{24}c_1 c_2 + \\cdots\\)</li>
        </ul>
        <p>These are power series in the Chern classes, truncated at the dimension of \\(X\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Recovery of the Curve Case</div>
    <div class="env-body">
        <p>For a line bundle \\(\\mathcal{L}\\) on a curve \\(C\\): \\(\\operatorname{ch}(\\mathcal{L}) = 1 + c_1(\\mathcal{L})\\) and \\(\\operatorname{td}(T_C) = 1 + \\frac{1}{2}c_1(T_C)\\). Then:</p>
        \\[\\chi(\\mathcal{L}) = \\int_C (1 + c_1(\\mathcal{L}))(1 + \\tfrac{1}{2}c_1(T_C)) = \\deg(\\mathcal{L}) + \\tfrac{1}{2}\\deg(T_C) + [\\text{degree 0 term from } C].\\]
        <p>Since \\(\\deg(T_C) = -\\deg(K_C) = -(2g-2) = 2 - 2g\\), we get \\(\\chi(\\mathcal{L}) = \\deg(\\mathcal{L}) + 1 - g\\), recovering the classical Riemann-Roch.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Grothendieck-Riemann-Roch</div>
    <div class="env-body">
        <p>Grothendieck's version (1957) vastly generalizes Hirzebruch's theorem. For a proper morphism \\(f: X \\to Y\\) and a coherent sheaf \\(\\mathcal{F}\\) on \\(X\\):</p>
        \\[\\operatorname{ch}(Rf_*\\mathcal{F}) = f_*(\\operatorname{ch}(\\mathcal{F}) \\cdot \\operatorname{td}(T_{X/Y}))\\]
        <p>in the Chow ring (or K-theory) of \\(Y\\). When \\(Y\\) is a point, this reduces to HRR.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gap-sequence"></div>
`,
            visualizations: [
                {
                    id: 'viz-gap-sequence',
                    title: 'Weierstrass Gap Sequence',
                    description: 'At a point \\(P\\) on a curve of genus \\(g\\), the Weierstrass gap sequence consists of the \\(g\\) positive integers \\(n\\) for which \\(\\ell(nP) = \\ell((n-1)P)\\) (no new function appears). For a general point, the gaps are \\(1, 2, \\ldots, g\\). Weierstrass points have non-standard gap sequences.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var g = 4;
                        var isWeierstrass = false;

                        VizEngine.createSlider(controls, 'Genus g', 1, 8, g, 1, function(v) {
                            g = Math.round(v);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle Weierstrass', function() {
                            isWeierstrass = !isWeierstrass;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Weierstrass Gap Sequence (genus ' + g + ')', W / 2, 20, viz.colors.white, 14);
                            viz.screenText(isWeierstrass ? 'Weierstrass point (non-standard gaps)' : 'General point (standard gaps: 1,2,...,g)', W / 2, 40, isWeierstrass ? viz.colors.orange : viz.colors.teal, 11);

                            // Compute l(nP) for n = 0..2g+2
                            var maxN = 2 * g + 2;
                            var lValues = [];
                            var gaps = [];
                            var nonGaps = [];

                            if (!isWeierstrass) {
                                // General point: gaps are 1..g
                                for (var n = 0; n <= maxN; n++) {
                                    if (n === 0) lValues.push(1);
                                    else if (n <= g) lValues.push(1); // l(nP) stays 1 for n=1..g (gaps)
                                    else lValues.push(n - g + 1); // non-special after that
                                }
                                for (var n = 1; n <= g; n++) gaps.push(n);
                            } else {
                                // Example Weierstrass: hyperelliptic, gaps are odd numbers 1,3,5,...,2g-1
                                for (var n = 0; n <= maxN; n++) {
                                    if (n === 0) lValues.push(1);
                                    else {
                                        var prev = lValues[n - 1];
                                        // For hyperelliptic Weierstrass point, l(nP) increases at even n
                                        if (n % 2 === 0 && n <= 2 * g) {
                                            lValues.push(prev + 1);
                                        } else if (n > 2 * g) {
                                            lValues.push(n - g + 1);
                                        } else {
                                            lValues.push(prev);
                                        }
                                    }
                                }
                                for (var n = 0; n < g; n++) gaps.push(2 * n + 1);
                            }

                            // Bar chart of l(nP)
                            var plotL = 50, plotR = W - 30;
                            var plotT = 65, plotB = 220;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            var barW = Math.min(25, plotW / (maxN + 1) - 2);
                            var maxL = lValues[maxN];

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotR, plotB);
                            ctx.stroke();

                            for (var n = 0; n <= maxN; n++) {
                                var cx = plotL + (n + 0.5) * (plotW / (maxN + 1));
                                var barH = (lValues[n] / maxL) * plotH;

                                var isGap = (n > 0 && lValues[n] === lValues[n - 1]);

                                ctx.fillStyle = isGap ? viz.colors.red + 'aa' : viz.colors.blue + 'aa';
                                ctx.fillRect(cx - barW / 2, plotB - barH, barW, barH);

                                // n label
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(n.toString(), cx, plotB + 3);

                                // l value
                                ctx.textBaseline = 'bottom';
                                ctx.fillStyle = isGap ? viz.colors.red : viz.colors.blue;
                                ctx.fillText(lValues[n].toString(), cx, plotB - barH - 2);
                            }

                            viz.screenText('n (multiplicity at P)', (plotL + plotR) / 2, plotB + 18, viz.colors.text, 10);
                            viz.screenText('l(nP)', plotL - 18, (plotT + plotB) / 2, viz.colors.text, 10);

                            // Gap sequence display
                            var gapY = 255;
                            viz.screenText('Gap sequence:', 60, gapY, viz.colors.white, 12);
                            var gapStr = gaps.join(', ');
                            viz.screenText('{' + gapStr + '}', W / 2, gapY + 20, viz.colors.red, 13);
                            viz.screenText('(' + gaps.length + ' gaps = g = ' + g + ')', W / 2, gapY + 40, viz.colors.text, 11);

                            // Weierstrass weight
                            var standardGaps = [];
                            for (var i = 1; i <= g; i++) standardGaps.push(i);
                            var weight = 0;
                            for (var i = 0; i < g; i++) weight += gaps[i] - standardGaps[i];
                            viz.screenText('Weierstrass weight = ' + weight + (weight > 0 ? ' (Weierstrass point!)' : ' (ordinary point)'), W / 2, gapY + 60, weight > 0 ? viz.colors.orange : viz.colors.teal, 11);

                            // Legend
                            var legY = 340;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotL, legY, 12, 12);
                            ctx.fillText('Non-gap (l increases)', plotL + 16, legY + 10);

                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(plotL + 200, legY, 12, 12);
                            ctx.fillText('Gap (l stays same)', plotL + 216, legY + 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write out the Hirzebruch-Riemann-Roch formula explicitly for a line bundle \\(\\mathcal{L}\\) on a smooth projective surface \\(S\\), recovering the Noether formula when \\(\\mathcal{L} = \\mathcal{O}_S\\).',
                    hint: 'Expand \\(\\operatorname{ch}(\\mathcal{L}) = 1 + c_1(\\mathcal{L}) + \\frac{1}{2}c_1(\\mathcal{L})^2\\) and \\(\\operatorname{td}(T_S) = 1 + \\frac{1}{2}c_1(T_S) + \\frac{1}{12}(c_1(T_S)^2 + c_2(T_S))\\).',
                    solution: '\\(\\chi(\\mathcal{L}) = \\int_S (1 + c_1(\\mathcal{L}) + \\frac{1}{2}c_1^2)(1 + \\frac{1}{2}c_1(T) + \\frac{1}{12}(c_1(T)^2 + c_2(T)))\\). The degree 2 part (the only part that survives integration on a surface) is: \\(\\frac{1}{2}c_1(\\mathcal{L})^2 + \\frac{1}{2}c_1(\\mathcal{L}) \\cdot c_1(T) + \\frac{1}{12}(c_1(T)^2 + c_2(T))\\). Using \\(c_1(T) = -K_S\\): \\(\\chi(\\mathcal{L}) = \\frac{1}{2}(\\mathcal{L}^2 - \\mathcal{L} \\cdot K) + \\frac{1}{12}(K^2 + c_2)\\). For \\(\\mathcal{L} = \\mathcal{O}\\): \\(\\chi(\\mathcal{O}) = \\frac{1}{12}(K^2 + e(S))\\), the Noether formula.'
                },
                {
                    question: 'Show that for a curve \\(C\\) of genus \\(g\\), the total number of Weierstrass points (counted with weight) is \\(g^3 - g\\).',
                    hint: 'The Weierstrass weight at a point \\(P\\) is \\(\\sum_{i=1}^g (n_i - i)\\) where \\(n_1 < \\cdots < n_g\\) are the gaps. The total weight over all points is computed using the Wronskian of a basis of \\(H^0(K)\\).',
                    solution: 'The Wronskian of a basis \\(\\omega_1, \\ldots, \\omega_g\\) of \\(H^0(K)\\) is a section of \\(K^{\\otimes g(g+1)/2}\\), which has degree \\(\\frac{g(g+1)}{2}(2g-2) = g(g+1)(g-1) = g^3 - g\\). The order of vanishing of the Wronskian at each point equals the Weierstrass weight. So the total weight is \\(g^3 - g\\). For \\(g \\geq 2\\), this is positive, so Weierstrass points always exist.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge to Elliptic Curves',
            content: `
<h2>Looking Ahead: From Riemann-Roch to Elliptic Curves</h2>

<div class="env-block intuition">
    <div class="env-title">What We Have Built</div>
    <div class="env-body">
        <p>The Riemann-Roch theorem is the keystone of the theory of algebraic curves. Starting from the foundations of algebraic sets (Chapter 0), through projective geometry, local theory, sheaves, and cohomology, we have arrived at a theorem that unifies dimension counting, topology, and function theory on curves.</p>
    </div>
</div>

<h3>The Journey So Far</h3>

<p>Let us reflect on the logical arc:</p>
<ol>
    <li><strong>Chapters 0-3 (Affine Geometry):</strong> Algebraic sets, coordinate rings, morphisms, dimension. We learned to translate geometry into algebra.</li>
    <li><strong>Chapters 4-6 (Projective Geometry):</strong> Projective space eliminated the pathologies of "points at infinity." Bezout's theorem gave us intersection theory.</li>
    <li><strong>Chapters 7-9 (Local Theory):</strong> Local rings, tangent spaces, singularities, blowups. We learned to analyze curves at individual points.</li>
    <li><strong>Chapters 10-12 (Sheaves and Schemes):</strong> The modern language of algebraic geometry. Sheaves let us work globally with locally defined data; schemes generalized varieties to include nilpotents and non-closed fields.</li>
    <li><strong>Chapters 13-15 (Cohomology and Divisors):</strong> Divisors, line bundles, differentials, sheaf cohomology. The toolkit for Riemann-Roch.</li>
    <li><strong>Chapter 16 (Riemann-Roch):</strong> The synthesis. One formula, connecting all the threads.</li>
</ol>

<h3>What Comes Next</h3>

<p>In <strong>Chapter 17</strong>, we focus on the most accessible and richest class of curves: <strong>elliptic curves</strong> (genus 1). Riemann-Roch will be our primary tool:</p>

<ul>
    <li>The embedding \\(C \\hookrightarrow \\mathbb{P}^2\\) as a plane cubic comes from \\(\\ell(3P) = 3\\).</li>
    <li>The group law on an elliptic curve is intimately connected to the linear equivalence of divisors.</li>
    <li>The Weierstrass \\(\\wp\\)-function arises from the space \\(L(2P)\\), which has dimension 2 by Riemann-Roch.</li>
    <li>Over finite fields, the Hasse-Weil bound (a consequence of Riemann-Roch for the Frobenius) constrains the number of rational points.</li>
</ul>

<p>Later, <strong>Chapter 18</strong> will extend these ideas to surfaces and higher-dimensional varieties, where the Hirzebruch-Riemann-Roch theorem (Section 6 of this chapter) becomes the central tool.</p>

<div class="env-block remark">
    <div class="env-title">The Riemann-Roch Paradigm</div>
    <div class="env-body">
        <p>The pattern established by Riemann-Roch recurs throughout mathematics: an <em>index theorem</em> expresses an analytic invariant (dimension of a solution space) in terms of topological data (characteristic classes, genus, degree). The Atiyah-Singer index theorem in differential geometry, the Gauss-Bonnet theorem in Riemannian geometry, and Riemann-Roch are all instances of this profound principle. Algebraic geometry provides perhaps the cleanest and most computable setting for these ideas.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rr-summary"></div>
`,
            visualizations: [
                {
                    id: 'viz-rr-summary',
                    title: 'Riemann-Roch Summary: The Full Picture',
                    description: 'A comprehensive summary of how Riemann-Roch controls the geometry of curves at each genus, showing the key dimensions and maps.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Riemann-Roch at a Glance', W / 2, 22, viz.colors.white, 16);
                            viz.screenText('l(D) - l(K-D) = deg(D) - g + 1', W / 2, 46, viz.colors.teal, 13);

                            // Table
                            var cols = ['g', 'deg K', 'l(K)', 'Curve Type', 'Key Map'];
                            var rows = [
                                ['0', '-2', '0', 'Rational (P^1)', 'l(P)=2: isom to P^1'],
                                ['1', '0', '1', 'Elliptic', 'l(3P)=3: cubic in P^2'],
                                ['2', '2', '2', 'Hyperelliptic', '|K|: 2:1 to P^1'],
                                ['3', '4', '3', 'Plane quartic*', '|K|: embed in P^2'],
                                ['4', '6', '4', 'Intersect. of quadrics*', '|K|: embed in P^3'],
                                ['5', '8', '5', 'In P^4*', '|K|: embed in P^4'],
                            ];

                            var colWidths = [30, 55, 45, 155, 180];
                            var tableX = 20;
                            var tableY = 72;
                            var rowH = 24;

                            // Header
                            var cx = tableX;
                            for (var c = 0; c < cols.length; c++) {
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(cols[c], cx + colWidths[c] / 2, tableY);
                                cx += colWidths[c];
                            }

                            // Header line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(tableX, tableY + 12);
                            ctx.lineTo(tableX + colWidths.reduce(function(a, b) { return a + b; }, 0), tableY + 12);
                            ctx.stroke();

                            // Rows
                            var rowColors = [viz.colors.blue, viz.colors.green, viz.colors.purple, viz.colors.orange, viz.colors.teal, viz.colors.yellow];
                            for (var r = 0; r < rows.length; r++) {
                                var ry = tableY + (r + 1) * rowH + 4;
                                cx = tableX;

                                // Row highlight
                                ctx.fillStyle = rowColors[r] + '0c';
                                ctx.fillRect(tableX, ry - rowH / 2 + 2, colWidths.reduce(function(a, b) { return a + b; }, 0), rowH);

                                for (var c = 0; c < rows[r].length; c++) {
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = c === 0 ? rowColors[r] : viz.colors.text;
                                    ctx.fillText(rows[r][c], cx + colWidths[c] / 2, ry);
                                    cx += colWidths[c];
                                }
                            }

                            viz.screenText('* = non-hyperelliptic case', W / 2, tableY + (rows.length + 1) * rowH + 18, viz.colors.text, 9);

                            // Key insight box
                            var boxY = tableY + (rows.length + 1) * rowH + 38;
                            ctx.fillStyle = viz.colors.teal + '12';
                            ctx.strokeStyle = viz.colors.teal + '44';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.roundRect(30, boxY, W - 60, 80, 8);
                            ctx.fill();
                            ctx.stroke();

                            viz.screenText('Key Thresholds (by degree relative to genus)', W / 2, boxY + 15, viz.colors.teal, 11);
                            viz.screenText('deg D >= 2g-1: l(D) = deg D - g + 1 (exact)', W / 2, boxY + 35, viz.colors.text, 10);
                            viz.screenText('deg D >= 2g: |D| is base-point-free', W / 2, boxY + 50, viz.colors.text, 10);
                            viz.screenText('deg D >= 2g+1: |D| is very ample (embedding)', W / 2, boxY + 65, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using Riemann-Roch, show that every curve of genus \\(g\\) can be embedded in \\(\\mathbb{P}^{2g+1}\\).',
                    hint: 'Take a divisor of degree \\(2g + 1\\). What does Riemann-Roch say about \\(\\ell(D)\\)? Why is \\(|D|\\) very ample?',
                    solution: 'Let \\(D\\) be any divisor of degree \\(d = 2g + 1\\). Since \\(d \\geq 2g - 1\\), \\(D\\) is non-special, so \\(\\ell(D) = d - g + 1 = g + 2\\). Since \\(d \\geq 2g + 1\\), \\(|D|\\) is very ample, defining an embedding \\(C \\hookrightarrow \\mathbb{P}^{g+1}\\). Actually this embeds into \\(\\mathbb{P}^{g+1}\\), which is better than \\(\\mathbb{P}^{2g+1}\\). To get \\(\\mathbb{P}^{2g+1}\\) specifically: any curve of genus \\(g\\) embeds in \\(\\mathbb{P}^{g+1}\\) by the above, and \\(\\mathbb{P}^{g+1} \\subset \\mathbb{P}^{2g+1}\\). In fact, this shows the stronger result that \\(\\mathbb{P}^{g+1}\\) suffices.'
                },
                {
                    question: 'Let \\(C\\) be a smooth curve of genus 4. Determine whether \\(C\\) can be embedded as a degree 6 curve in \\(\\mathbb{P}^3\\). What does Riemann-Roch say?',
                    hint: 'For a degree 6 divisor on a genus 4 curve, compute \\(\\ell(D)\\). Compare with the canonical embedding.',
                    solution: 'For \\(D\\) of degree 6 on a genus 4 curve: \\(\\deg D = 6 > 2g - 2 = 6\\)... actually \\(6 = 2 \\cdot 4 - 2\\), so \\(\\deg D = 2g - 2\\). This means \\(D\\) could be special (in fact \\(D \\sim K\\) gives \\(\\ell(K) = 4\\)). If \\(D \\sim K\\), the canonical map gives \\(C \\to \\mathbb{P}^3\\) as a degree 6 curve. For non-hyperelliptic genus 4, this is indeed an embedding. So yes, a non-hyperelliptic genus 4 curve embeds as a degree 6 curve in \\(\\mathbb{P}^3\\), as the canonical curve. It is the complete intersection of a quadric and a cubic surface in \\(\\mathbb{P}^3\\).'
                },
                {
                    question: 'Explain why the Riemann-Roch theorem can be viewed as an "index theorem." What are the "kernel" and "cokernel" in this interpretation?',
                    hint: 'Think of \\(\\ell(D) = h^0\\) as the kernel and \\(\\ell(K-D) = h^1\\) as the cokernel of some operator.',
                    solution: 'Riemann-Roch computes the index \\(h^0 - h^1 = \\chi\\) of the Dolbeault operator \\(\\bar{\\partial}: \\mathcal{A}^0(\\mathcal{O}(D)) \\to \\mathcal{A}^{0,1}(\\mathcal{O}(D))\\) (in the complex analytic setting). The kernel \\(\\ker \\bar{\\partial} = H^0(\\mathcal{O}(D))\\) consists of holomorphic sections (dimension \\(\\ell(D)\\)). The cokernel \\(\\operatorname{coker} \\bar{\\partial} = H^1(\\mathcal{O}(D)) \\cong H^0(\\mathcal{O}(K-D))^\\vee\\) (by Serre/Hodge duality) has dimension \\(\\ell(K-D)\\). The index \\(\\ell(D) - \\ell(K-D)\\) is topological: it equals \\(\\deg D - g + 1\\). This is exactly the paradigm of the Atiyah-Singer index theorem.'
                },
                {
                    question: 'Prove that on a curve of genus \\(g \\geq 2\\), the canonical linear system \\(|K|\\) has no base points.',
                    hint: 'Show that for every point \\(P\\), \\(\\ell(K - P) = \\ell(K) - 1\\). Use Riemann-Roch applied to \\(K - P\\).',
                    solution: 'By Riemann-Roch for \\(D = K - P\\): \\(\\ell(K-P) - \\ell(K - (K-P)) = \\deg(K-P) - g + 1\\), i.e., \\(\\ell(K-P) - \\ell(P) = (2g-3) - g + 1 = g - 2\\). Since \\(\\deg(P) = 1\\) and \\(g \\geq 2\\), we have \\(\\ell(P) = 1\\) (only constants). So \\(\\ell(K-P) = g - 1 = \\ell(K) - 1\\). This means that for every \\(P\\), removing \\(P\\) from \\(K\\) decreases \\(\\ell\\) by 1, so there exists a section of \\(|K|\\) not vanishing at \\(P\\). Hence \\(|K|\\) is base-point-free.'
                }
            ]
        }
    ]
});
