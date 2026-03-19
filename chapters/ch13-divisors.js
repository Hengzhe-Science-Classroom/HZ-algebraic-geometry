window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'Divisors & Line Bundles',
    subtitle: 'Measuring zeros and poles',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Divisors?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Given a smooth projective curve \\(C\\), what rational functions can live on \\(C\\)? A rational function \\(f \\in k(C)^*\\) has zeros and poles, each occurring at specific points with specific multiplicities. The <em>divisor</em> of \\(f\\) is the formal bookkeeping device that records this data: where \\(f\\) vanishes, where it blows up, and to what order.</p>
    </div>
</div>

<p>In complex analysis, a meromorphic function on the Riemann sphere \\(\\mathbb{P}^1\\) is determined (up to a constant) by its zeros and poles. This is because any two meromorphic functions with the same zeros and poles differ by a nowhere-vanishing holomorphic function, which on a compact Riemann surface must be constant. Divisors generalize this observation to arbitrary algebraic varieties.</p>

<p>Divisors appear in algebraic geometry for at least three reasons:</p>
<ol>
    <li><strong>Encoding geometry of subvarieties.</strong> A divisor on a surface is a formal sum of curves; on a curve, it is a formal sum of points. This gives a flexible language for codimension-1 geometry.</li>
    <li><strong>Controlling poles of functions.</strong> The vector space \\(L(D) = \\{f \\in k(X)^* : \\operatorname{div}(f) + D \\geq 0\\} \\cup \\{0\\}\\) consists of all rational functions whose poles are "bounded" by \\(D\\). The dimension of \\(L(D)\\) is the subject of the Riemann-Roch theorem.</li>
    <li><strong>Building maps to projective space.</strong> A basis of \\(L(D)\\) defines a morphism \\(X \\to \\mathbb{P}^n\\). The geometry of this map (whether it is an embedding, its degree, its image) is governed by the divisor \\(D\\).</li>
</ol>

<h3>A First Example</h3>

<p>Consider the rational function \\(f(x) = \\frac{x(x-1)}{(x-2)^3}\\) on \\(\\mathbb{P}^1\\). It has:</p>
<ul>
    <li>A simple zero at \\(x = 0\\) (order \\(+1\\))</li>
    <li>A simple zero at \\(x = 1\\) (order \\(+1\\))</li>
    <li>A pole of order 3 at \\(x = 2\\) (order \\(-3\\))</li>
    <li>A pole of order \\(-(-3+2) = 1\\)... actually, we must account for the point at infinity. In homogeneous coordinates \\([X:Y]\\), \\(f = \\frac{X(X-Y)}{(X-2Y)^3} \\cdot Y\\), so there is a simple zero at \\(\\infty\\) (order \\(+1\\)).</li>
</ul>

<p>The divisor is \\(\\operatorname{div}(f) = [0] + [1] - 3[2] + [\\infty]\\), and its degree is \\(1 + 1 - 3 + 1 = 0\\). This is no coincidence: on any smooth projective curve, the degree of a principal divisor is always zero.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The theory of divisors on curves originated with Abel and Jacobi in the 1820s-1830s, in their study of elliptic and abelian integrals. The abstract algebraic formulation was developed by Dedekind, Weber (1882), and later refined by Weil and Cartier. The connection to line bundles and sheaves was established by Serre and Grothendieck in the 1950s.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-divisor-on-curve',
                    title: 'Divisor on a Curve',
                    description: 'A divisor \\(D = \\sum n_i P_i\\) is a formal sum of points with integer multiplicities. Positive multiplicities (blue) represent zeros; negative multiplicities (red) represent poles. The degree \\(\\deg(D) = \\sum n_i\\). Drag points to rearrange.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 220, scale: 50
                        });

                        // Curve: y^2 = x^3 - x (elliptic curve)
                        var points = [
                            { x: -1, n: 2, label: 'P' },
                            { x: 0, n: -1, label: 'Q' },
                            { x: 0.5, n: 1, label: 'R' },
                            { x: 1, n: -3, label: 'S' },
                            { x: 1.5, n: 1, label: 'T' }
                        ];

                        function curveY(x) {
                            var val = x * x * x - x;
                            return val >= 0 ? Math.sqrt(val) : NaN;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw grid and axes
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Draw curve y^2 = x^3 - x
                            ctx.strokeStyle = viz.colors.white + '66';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = -200; i <= 300; i++) {
                                var x = i / 100;
                                var y = curveY(x);
                                if (isNaN(y)) { started = false; continue; }
                                var s = viz.toScreen(x, y);
                                if (!started) { ctx.moveTo(s[0], s[1]); started = true; }
                                else ctx.lineTo(s[0], s[1]);
                            }
                            ctx.stroke();
                            // Lower branch
                            ctx.beginPath();
                            started = false;
                            for (var i = -200; i <= 300; i++) {
                                var x = i / 100;
                                var y = curveY(x);
                                if (isNaN(y)) { started = false; continue; }
                                var s = viz.toScreen(x, -y);
                                if (!started) { ctx.moveTo(s[0], s[1]); started = true; }
                                else ctx.lineTo(s[0], s[1]);
                            }
                            ctx.stroke();

                            // Curve label
                            viz.screenText('y\u00B2 = x\u00B3 \u2212 x', viz.width - 80, 30, viz.colors.white + 'aa', 13);

                            // Draw divisor points on the curve
                            var degree = 0;
                            var divStr = 'D = ';
                            var terms = [];
                            for (var j = 0; j < points.length; j++) {
                                var p = points[j];
                                var y = curveY(p.x);
                                if (isNaN(y)) y = 0;
                                var color = p.n > 0 ? viz.colors.blue : viz.colors.red;
                                var radius = Math.min(Math.abs(p.n) * 3 + 4, 14);

                                // Draw point
                                var sp = viz.toScreen(p.x, y);
                                ctx.fillStyle = color + '44';
                                ctx.beginPath();
                                ctx.arc(sp[0], sp[1], radius + 4, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(sp[0], sp[1], radius, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                var label = p.label + ' (n=' + (p.n > 0 ? '+' : '') + p.n + ')';
                                ctx.fillStyle = color;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(label, sp[0], sp[1] - radius - 6);

                                degree += p.n;
                                var coeff = Math.abs(p.n) === 1 ? '' : Math.abs(p.n);
                                var sign = p.n > 0 ? '+' : '\u2212';
                                if (j === 0 && p.n > 0) sign = '';
                                terms.push(sign + coeff + '[' + p.label + ']');
                            }

                            // Divisor info
                            divStr += terms.join(' ');
                            viz.screenText(divStr, viz.width / 2, viz.height - 40, viz.colors.white, 13);
                            var degColor = degree === 0 ? viz.colors.green : viz.colors.yellow;
                            viz.screenText('deg(D) = ' + degree, viz.width / 2, viz.height - 20, degColor, 13);
                        }

                        // Sliders for multiplicities
                        for (var k = 0; k < points.length; k++) {
                            (function(idx) {
                                VizEngine.createSlider(controls, points[idx].label, -4, 4, points[idx].n, 1, function(v) {
                                    points[idx].n = Math.round(v);
                                    draw();
                                });
                            })(k);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Weil Divisors
        // ================================================================
        {
            id: 'sec-weil',
            title: 'Weil Divisors',
            content: `
<h2>Weil Divisors</h2>

<div class="env-block definition">
    <div class="env-title">Definition 13.1 (Weil Divisor)</div>
    <div class="env-body">
        <p>Let \\(X\\) be a noetherian integral scheme that is regular in codimension one (i.e., every local ring \\(\\mathcal{O}_{X,x}\\) at a codimension-1 point \\(x\\) is a discrete valuation ring). A <strong>Weil divisor</strong> on \\(X\\) is a formal integer linear combination of codimension-1 irreducible closed subvarieties (called <em>prime divisors</em>):</p>
        \\[D = \\sum_{Y} n_Y \\cdot Y, \\quad n_Y \\in \\mathbb{Z},\\]
        <p>where the sum is over prime divisors \\(Y \\subset X\\), and all but finitely many \\(n_Y\\) are zero.</p>
    </div>
</div>

<p>The group of all Weil divisors on \\(X\\) is denoted \\(\\operatorname{Div}(X)\\). It is the free abelian group on the set of prime divisors of \\(X\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Divisors in Different Dimensions</div>
    <div class="env-body">
        <ul>
            <li><strong>On a curve:</strong> prime divisors are closed points. A Weil divisor is a formal sum \\(D = \\sum n_i P_i\\) of points with integer coefficients.</li>
            <li><strong>On a surface:</strong> prime divisors are irreducible curves. For instance, on \\(\\mathbb{P}^2\\), the line \\(V(X_0)\\) and the conic \\(V(X_0^2 + X_1^2 - X_2^2)\\) are prime divisors.</li>
            <li><strong>On \\(\\mathbb{A}^n\\):</strong> prime divisors correspond to irreducible hypersurfaces \\(V(f)\\) for irreducible \\(f \\in k[x_1, \\ldots, x_n]\\).</li>
        </ul>
    </div>
</div>

<h3>The Divisor of a Rational Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition 13.2 (Order of Vanishing)</div>
    <div class="env-body">
        <p>Let \\(Y \\subset X\\) be a prime divisor with generic point \\(\\eta\\). Since \\(\\mathcal{O}_{X,\\eta}\\) is a DVR with uniformizer \\(\\pi\\), every nonzero \\(f \\in k(X)^*\\) can be written \\(f = u \\pi^n\\) for a unit \\(u\\) and a unique integer \\(n\\). The <strong>order of vanishing</strong> of \\(f\\) along \\(Y\\) is</p>
        \\[v_Y(f) = n.\\]
        <p>If \\(v_Y(f) > 0\\), then \\(f\\) has a <strong>zero</strong> of order \\(n\\) along \\(Y\\). If \\(v_Y(f) < 0\\), then \\(f\\) has a <strong>pole</strong> of order \\(|n|\\) along \\(Y\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 13.3 (Principal Divisor)</div>
    <div class="env-body">
        <p>For \\(f \\in k(X)^*\\), the <strong>principal divisor</strong> (or <strong>divisor of \\(f\\)</strong>) is</p>
        \\[\\operatorname{div}(f) = \\sum_{Y} v_Y(f) \\cdot Y.\\]
        <p>This is a well-defined Weil divisor because \\(v_Y(f) = 0\\) for all but finitely many prime divisors \\(Y\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 13.4</div>
    <div class="env-body">
        <p>The map \\(\\operatorname{div}: k(X)^* \\to \\operatorname{Div}(X)\\) is a group homomorphism. That is, \\(\\operatorname{div}(fg) = \\operatorname{div}(f) + \\operatorname{div}(g)\\).</p>
    </div>
</div>

<p><em>Proof.</em> This follows from the fact that each \\(v_Y\\) is a valuation: \\(v_Y(fg) = v_Y(f) + v_Y(g)\\). \\(\\square\\)</p>

<h3>Effective Divisors</h3>

<div class="env-block definition">
    <div class="env-title">Definition 13.5 (Effective Divisor)</div>
    <div class="env-body">
        <p>A Weil divisor \\(D = \\sum n_Y Y\\) is <strong>effective</strong>, written \\(D \\geq 0\\), if \\(n_Y \\geq 0\\) for all \\(Y\\). Intuitively, an effective divisor records only zeros, no poles.</p>
    </div>
</div>

<p>For any rational function \\(f\\), we can decompose \\(\\operatorname{div}(f) = \\operatorname{div}_0(f) - \\operatorname{div}_\\infty(f)\\) into its "zero part" and "pole part," both of which are effective.</p>

<div class="viz-placeholder" data-viz="viz-principal-divisor"></div>
`,
            visualizations: [
                {
                    id: 'viz-principal-divisor',
                    title: 'Principal Divisor: div(f)',
                    description: 'The principal divisor of a rational function records its zeros (blue, above axis) and poles (red, below axis). Watch how the divisor changes as we vary the function. The total degree is always zero on a projective curve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 80, originY: 200, scale: 60
                        });

                        var zeroPos = [0.5, 2.0];
                        var polePos = [3.5];
                        var time = 0;
                        var animating = true;

                        var animBtn = VizEngine.createButton(controls, 'Pause', function() {
                            animating = !animating;
                            animBtn.textContent = animating ? 'Pause' : 'Play';
                        });

                        function f(x, t) {
                            // f(x) = (x - z1)(x - z2) / (x - p1)^2 with moving zeros
                            var z1 = zeroPos[0] + 0.3 * Math.sin(t * 0.001);
                            var z2 = zeroPos[1] + 0.2 * Math.cos(t * 0.0013);
                            var p1 = polePos[0];
                            var num = (x - z1) * (x - z2);
                            var den = (x - p1) * (x - p1);
                            if (Math.abs(den) < 0.001) return NaN;
                            return num / den;
                        }

                        function draw(t) {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw axes
                            // x-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(40, viz.originY);
                            ctx.lineTo(viz.width - 20, viz.originY);
                            ctx.stroke();
                            // y-axis
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, 20);
                            ctx.lineTo(viz.originX, viz.height - 20);
                            ctx.stroke();

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var gx = -1; gx <= 7; gx++) {
                                var sgx = viz.originX + gx * viz.scale;
                                ctx.beginPath(); ctx.moveTo(sgx, 20); ctx.lineTo(sgx, viz.height - 20); ctx.stroke();
                            }
                            for (var gy = -3; gy <= 3; gy++) {
                                var sgy = viz.originY - gy * viz.scale;
                                ctx.beginPath(); ctx.moveTo(40, sgy); ctx.lineTo(viz.width - 20, sgy); ctx.stroke();
                            }

                            var z1 = zeroPos[0] + 0.3 * Math.sin(t * 0.001);
                            var z2 = zeroPos[1] + 0.2 * Math.cos(t * 0.0013);
                            var p1 = polePos[0];

                            // Draw function
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = -60; i <= 480; i++) {
                                var x = (i - 80) / viz.scale + (viz.originX - 80) / viz.scale;
                                x = -1 + i / 60;
                                var y = f(x, t);
                                if (isNaN(y) || Math.abs(y) > 5) { started = false; continue; }
                                var sx = viz.originX + x * viz.scale;
                                var sy = viz.originY - y * viz.scale;
                                if (sx < 40 || sx > viz.width - 20) { started = false; continue; }
                                if (!started) { ctx.moveTo(sx, sy); started = true; }
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Mark zeros
                            var zeros = [z1, z2];
                            for (var zi = 0; zi < zeros.length; zi++) {
                                var zx = zeros[zi];
                                var sp = [viz.originX + zx * viz.scale, viz.originY];
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath(); ctx.arc(sp[0], sp[1], 10, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(sp[0], sp[1], 6, 0, Math.PI * 2); ctx.fill();
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('+1', sp[0], sp[1] - 14);
                            }

                            // Mark pole
                            var pp = [viz.originX + p1 * viz.scale, viz.originY];
                            ctx.fillStyle = viz.colors.red + '44';
                            ctx.beginPath(); ctx.arc(pp[0], pp[1], 12, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.red;
                            ctx.beginPath(); ctx.arc(pp[0], pp[1], 6, 0, Math.PI * 2); ctx.fill();
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u22122', pp[0], pp[1] + 22);

                            // Vertical asymptote
                            ctx.strokeStyle = viz.colors.red + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(pp[0], 20); ctx.lineTo(pp[0], viz.height - 20); ctx.stroke();
                            ctx.setLineDash([]);

                            // Divisor bar at bottom
                            var barY = viz.height - 50;
                            viz.screenText('div(f) = [' + z1.toFixed(2) + '] + [' + z2.toFixed(2) + '] \u2212 2[' + p1.toFixed(1) + ']', viz.width / 2, barY, viz.colors.white, 12);
                            var deg = 1 + 1 - 2;
                            viz.screenText('deg = ' + deg + '  (always 0 on projective curve, here we see affine part)', viz.width / 2, barY + 18, viz.colors.green, 10);

                            // Title
                            viz.screenText('f(x) = (x \u2212 z\u2081)(x \u2212 z\u2082) / (x \u2212 p)\u00B2', viz.width / 2, 16, viz.colors.teal, 13);
                        }

                        viz.animate(function(t) {
                            if (animating) time = t;
                            draw(time);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\operatorname{div}(f)\\) for \\(f = \\frac{x^2 - 1}{x^3}\\) on \\(\\mathbb{P}^1\\). What is the degree?',
                    hint: 'Factor the numerator. Remember to account for the point at infinity by switching to the coordinate \\(y = 1/x\\).',
                    solution: 'We have \\(f = \\frac{(x-1)(x+1)}{x^3}\\), so \\(f\\) has simple zeros at \\(x=1\\) and \\(x=-1\\), and a pole of order 3 at \\(x=0\\). At \\(\\infty\\), substituting \\(x = 1/y\\): \\(f = \\frac{1/y^2 - 1}{1/y^3} = \\frac{y^3(1-y^2)}{y^2} = y - y^3\\), which has a simple zero at \\(y=0\\) (i.e., \\(x=\\infty\\)). So \\(\\operatorname{div}(f) = [1] + [-1] - 3[0] + [\\infty]\\), and \\(\\deg = 1+1-3+1 = 0\\).'
                },
                {
                    question: 'Let \\(D = 3P - 2Q + R\\) be a divisor on a curve \\(C\\). Is \\(D\\) effective? What is \\(\\deg(D)\\)?',
                    hint: 'Check the sign of each coefficient.',
                    solution: '\\(D\\) is not effective because the coefficient of \\(Q\\) is \\(-2 < 0\\). The degree is \\(3 + (-2) + 1 = 2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Cartier Divisors
        // ================================================================
        {
            id: 'sec-cartier',
            title: 'Cartier Divisors',
            content: `
<h2>Cartier Divisors</h2>

<div class="env-block intuition">
    <div class="env-title">Why Another Kind of Divisor?</div>
    <div class="env-body">
        <p>Weil divisors are geometric: they are formal sums of subvarieties. But on a singular variety, not every Weil divisor behaves well. Cartier divisors are <em>algebraic</em>: they are given locally by equations. On smooth varieties, Weil and Cartier divisors coincide. On singular varieties, Cartier divisors are better behaved because they correspond to line bundles (invertible sheaves).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 13.6 (Cartier Divisor)</div>
    <div class="env-body">
        <p>A <strong>Cartier divisor</strong> on a scheme \\(X\\) is an element of the group</p>
        \\[\\operatorname{CaDiv}(X) = \\Gamma(X, \\mathcal{K}_X^* / \\mathcal{O}_X^*),\\]
        <p>where \\(\\mathcal{K}_X^*\\) is the sheaf of nonzero rational functions and \\(\\mathcal{O}_X^*\\) is the sheaf of invertible regular functions. Concretely, a Cartier divisor is given by an open cover \\(\\{U_i\\}\\) and rational functions \\(f_i \\in k(X)^*\\) such that \\(f_i / f_j \\in \\mathcal{O}_X^*(U_i \\cap U_j)\\) for all \\(i, j\\).</p>
    </div>
</div>

<p>The functions \\(f_i\\) are called <strong>local equations</strong> for the Cartier divisor. The condition \\(f_i/f_j \\in \\mathcal{O}_X^*\\) means the \\(f_i\\) define the "same" zeros and poles on overlaps.</p>

<div class="env-block example">
    <div class="env-title">Example: A Hyperplane in \\(\\mathbb{P}^n\\)</div>
    <div class="env-body">
        <p>The hyperplane \\(H = V(X_0)\\) in \\(\\mathbb{P}^n\\) is a Cartier divisor. On the standard affine chart \\(U_i = \\{X_i \\neq 0\\}\\), the local equation is \\(f_i = X_0/X_i\\). On \\(U_i \\cap U_j\\), \\(f_i/f_j = X_j/X_i\\) is a unit in \\(\\mathcal{O}(U_i \\cap U_j)\\).</p>
    </div>
</div>

<h3>Weil vs. Cartier</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.7 (Weil = Cartier on Smooth Varieties)</div>
    <div class="env-body">
        <p>If \\(X\\) is a smooth variety (or more generally, a locally factorial scheme), then every Weil divisor is Cartier, and the natural map \\(\\operatorname{CaDiv}(X) \\to \\operatorname{Div}(X)\\) is an isomorphism.</p>
    </div>
</div>

<p>The key point is that on a smooth variety, every codimension-1 subvariety is locally defined by a single equation (because local rings are UFDs). On a singular variety, this can fail.</p>

<div class="env-block example">
    <div class="env-title">Example: Weil but Not Cartier</div>
    <div class="env-body">
        <p>On the quadric cone \\(X = V(xy - z^2) \\subset \\mathbb{A}^3\\), the line \\(L = V(x, z)\\) is a prime Weil divisor. But \\(L\\) is <em>not</em> Cartier: its local ring at the origin is not a DVR (the origin is a singular point). In fact, \\(2L\\) is Cartier (with local equation \\(x\\)), but \\(L\\) itself is not locally principal.</p>
    </div>
</div>

<h3>The Invertible Sheaf of a Cartier Divisor</h3>

<div class="env-block definition">
    <div class="env-title">Definition 13.8</div>
    <div class="env-body">
        <p>Given a Cartier divisor \\(D\\) with local equations \\(\\{(U_i, f_i)\\}\\), the <strong>invertible sheaf</strong> (line bundle) associated to \\(D\\) is</p>
        \\[\\mathcal{O}_X(D) = \\text{subsheaf of } \\mathcal{K}_X \\text{ generated by } f_i^{-1} \\text{ on } U_i.\\]
        <p>Equivalently, \\(\\mathcal{O}_X(D)(U) = \\{g \\in k(X) : g f_i \\in \\mathcal{O}_X(U \\cap U_i) \\text{ for all } i\\}\\).</p>
    </div>
</div>

<p>This gives a group homomorphism \\(\\operatorname{CaDiv}(X) \\to \\operatorname{Pic}(X)\\), where \\(\\operatorname{Pic}(X)\\) is the Picard group of isomorphism classes of invertible sheaves. The kernel consists of principal divisors.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'On the quadric cone \\(V(xy - z^2) \\subset \\mathbb{A}^3\\), verify that the Weil divisor \\(2L\\) where \\(L = V(x,z)\\) is Cartier by finding its local equation.',
                    hint: 'What regular function on the cone vanishes exactly on \\(2L\\)?',
                    solution: 'On the cone, \\(x = z^2/y\\) wherever \\(y \\neq 0\\). The function \\(x\\) vanishes on \\(V(x) \\cap X\\). But \\(V(x) \\cap X = V(x, z^2) = V(x,z)\\) set-theoretically, and since \\(x\\) has order 2 along \\(L\\) (because \\(x = z^2/y\\) and \\(z\\) is a uniformizer for \\(L\\) away from the vertex), \\(\\operatorname{div}(x)|_X = 2L\\). So \\(x\\) is the local equation for \\(2L\\), confirming it is Cartier (in fact principal).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Linear Equivalence & the Class Group
        // ================================================================
        {
            id: 'sec-linear-equivalence',
            title: 'Linear Equivalence & the Class Group',
            content: `
<h2>Linear Equivalence and the Class Group</h2>

<div class="env-block definition">
    <div class="env-title">Definition 13.9 (Linear Equivalence)</div>
    <div class="env-body">
        <p>Two Weil divisors \\(D\\) and \\(D'\\) on \\(X\\) are <strong>linearly equivalent</strong>, written \\(D \\sim D'\\), if there exists a rational function \\(f \\in k(X)^*\\) such that</p>
        \\[D - D' = \\operatorname{div}(f).\\]
        <p>In other words, \\(D\\) and \\(D'\\) differ by a principal divisor.</p>
    </div>
</div>

<p>Linear equivalence is the fundamental equivalence relation on divisors. Two divisors are linearly equivalent precisely when they define "the same" geometry, in the sense that the associated line bundles are isomorphic.</p>

<div class="env-block definition">
    <div class="env-title">Definition 13.10 (Divisor Class Group)</div>
    <div class="env-body">
        <p>The <strong>divisor class group</strong> (or <strong>Weil divisor class group</strong>) of \\(X\\) is</p>
        \\[\\operatorname{Cl}(X) = \\operatorname{Div}(X) / \\{\\text{principal divisors}\\}.\\]
        <p>The <strong>Picard group</strong> is</p>
        \\[\\operatorname{Pic}(X) = \\operatorname{CaDiv}(X) / \\{\\text{principal Cartier divisors}\\} \\cong \\{\\text{invertible sheaves}\\} / \\cong.\\]
    </div>
</div>

<p>On a smooth variety, \\(\\operatorname{Cl}(X) \\cong \\operatorname{Pic}(X)\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Class Groups</div>
    <div class="env-body">
        <ul>
            <li><strong>\\(\\operatorname{Cl}(\\mathbb{A}^n) = 0\\):</strong> every divisor on affine space is principal (because \\(k[x_1, \\ldots, x_n]\\) is a UFD).</li>
            <li><strong>\\(\\operatorname{Cl}(\\mathbb{P}^n) \\cong \\mathbb{Z}\\):</strong> generated by the class of a hyperplane \\(H\\). Every divisor is linearly equivalent to \\(dH\\) for some \\(d \\in \\mathbb{Z}\\), and \\(d\\) is the degree.</li>
            <li><strong>\\(\\operatorname{Cl}(\\text{quadric cone}) \\cong \\mathbb{Z}/2\\mathbb{Z}\\):</strong> the line \\(L\\) generates; \\(2L \\sim 0\\) but \\(L \\not\\sim 0\\).</li>
        </ul>
    </div>
</div>

<h3>Why Linear Equivalence Matters</h3>

<p>The point of identifying linearly equivalent divisors is that they carry the same function-theoretic information:</p>
<ul>
    <li>If \\(D \\sim D'\\), then \\(L(D) \\cong L(D')\\) as vector spaces (the isomorphism is multiplication by the function \\(f\\) with \\(\\operatorname{div}(f) = D - D'\\)).</li>
    <li>The associated line bundles \\(\\mathcal{O}(D)\\) and \\(\\mathcal{O}(D')\\) are isomorphic.</li>
    <li>The maps to projective space determined by \\(D\\) and \\(D'\\) are the same (up to change of coordinates in the target).</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Proposition 13.11 (Degree of Principal Divisors on Curves)</div>
    <div class="env-body">
        <p>If \\(C\\) is a smooth projective curve over an algebraically closed field, then for every \\(f \\in k(C)^*\\),</p>
        \\[\\deg(\\operatorname{div}(f)) = 0.\\]
        <p>Consequently, \\(\\deg\\) descends to a well-defined homomorphism \\(\\operatorname{Cl}(C) \\to \\mathbb{Z}\\).</p>
    </div>
</div>

<p>The kernel \\(\\operatorname{Cl}^0(C) = \\ker(\\deg)\\) is called the <strong>degree-zero part</strong> of the class group. For curves of genus \\(g \\geq 1\\), this is a rich object: it is the <strong>Jacobian variety</strong> \\(J(C)\\), an abelian variety of dimension \\(g\\).</p>

<div class="viz-placeholder" data-viz="viz-linear-equivalence"></div>
`,
            visualizations: [
                {
                    id: 'viz-linear-equivalence',
                    title: 'Linear Equivalence',
                    description: 'Two divisors \\(D\\) and \\(D\'\\) are linearly equivalent if \\(D - D\' = \\operatorname{div}(f)\\) for some rational function \\(f\\). Adjust the function parameter to see how moving zeros/poles of \\(f\\) transforms one divisor into another while preserving the class.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 190, scale: 80
                        });

                        var param = 0.5;
                        VizEngine.createSlider(controls, 'Parameter t', 0, 1, param, 0.01, function(v) {
                            param = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw P^1 as a line segment
                            var lineY = 0;
                            var left = -2.5, right = 2.5;
                            var sl = viz.toScreen(left, lineY);
                            var sr = viz.toScreen(right, lineY);

                            // Background line
                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(sl[0], sl[1]);
                            ctx.lineTo(sr[0], sr[1]);
                            ctx.stroke();

                            viz.screenText('\u2119\u00B9', sr[0] + 15, sr[1], viz.colors.white, 13);

                            // D = 2[0] + [-1] (fixed)
                            // D' = [a] + [b] + [c] where a+b+c=1 (moving)
                            // f interpolates: div(f) = D' - D

                            // D: two points at 0 (mult 2) and one at -1
                            var dPoints = [
                                { x: -1, n: 1 },
                                { x: 0, n: 2 }
                            ];

                            // D': continuously interpolated
                            var a = -1 + param * 1.5;
                            var b = 0 + param * 0.5;
                            var c = 0 - param * 1;
                            var dpPoints = [
                                { x: a, n: 1 },
                                { x: b, n: 1 },
                                { x: c, n: 1 }
                            ];

                            // Draw D on upper row
                            var rowD = 1.0;
                            var rowDp = -1.0;

                            viz.screenText('D = 2[0] + [\u22121]', 100, viz.originY - rowD * viz.scale - 30, viz.colors.blue, 12, 'center');
                            viz.screenText('deg(D) = 3', 460, viz.originY - rowD * viz.scale - 30, viz.colors.blue, 11, 'center');

                            // Draw D line
                            ctx.strokeStyle = viz.colors.blue + '44';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(sl[0], viz.originY - rowD * viz.scale);
                            ctx.lineTo(sr[0], viz.originY - rowD * viz.scale);
                            ctx.stroke();

                            for (var i = 0; i < dPoints.length; i++) {
                                var dp = dPoints[i];
                                var sp = viz.toScreen(dp.x, rowD);
                                var r = dp.n * 4 + 3;
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath(); ctx.arc(sp[0], sp[1], r + 3, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(sp[0], sp[1], r, 0, Math.PI * 2); ctx.fill();
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('n=' + dp.n, sp[0], sp[1] - r - 6);
                            }

                            // Draw D' on lower row
                            viz.screenText("D' = [" + a.toFixed(1) + '] + [' + b.toFixed(1) + '] + [' + c.toFixed(1) + ']', 170, viz.originY - rowDp * viz.scale + 35, viz.colors.teal, 12, 'center');
                            viz.screenText("deg(D') = 3", 460, viz.originY - rowDp * viz.scale + 35, viz.colors.teal, 11, 'center');

                            ctx.strokeStyle = viz.colors.teal + '44';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(sl[0], viz.originY - rowDp * viz.scale);
                            ctx.lineTo(sr[0], viz.originY - rowDp * viz.scale);
                            ctx.stroke();

                            for (var j = 0; j < dpPoints.length; j++) {
                                var dpp = dpPoints[j];
                                var spp = viz.toScreen(dpp.x, rowDp);
                                ctx.fillStyle = viz.colors.teal + '44';
                                ctx.beginPath(); ctx.arc(spp[0], spp[1], 6, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(spp[0], spp[1], 4, 0, Math.PI * 2); ctx.fill();
                            }

                            // Connection arrows
                            ctx.strokeStyle = viz.colors.yellow + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            for (var k = 0; k < dpPoints.length; k++) {
                                var from = viz.toScreen(dpPoints[k].x, rowDp);
                                ctx.beginPath();
                                ctx.moveTo(from[0], from[1] - 6);
                                ctx.lineTo(from[0], viz.originY - rowD * viz.scale + 10);
                                ctx.stroke();
                            }
                            ctx.setLineDash([]);

                            // Label
                            viz.screenText("D ~ D'  (same degree, same class in Cl(C))", viz.width / 2, viz.height - 25, viz.colors.yellow, 12);
                            viz.screenText('Slide t to move D\' continuously within the linear equivalence class', viz.width / 2, viz.height - 8, viz.colors.text, 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that on \\(\\mathbb{P}^1\\), any two points are linearly equivalent: \\([a] \\sim [b]\\) for all \\(a, b \\in \\mathbb{P}^1\\).',
                    hint: 'Find a rational function with a zero at \\(a\\) and a pole at \\(b\\).',
                    solution: 'If \\(a = [a_0 : a_1]\\) and \\(b = [b_0 : b_1]\\), consider the rational function \\(f = \\frac{b_1 X_0 - b_0 X_1}{a_1 X_0 - a_0 X_1}\\) (ratio of two linear forms). Then \\(\\operatorname{div}(f) = [a] - [b]\\), so \\([a] \\sim [b]\\). This confirms \\(\\operatorname{Cl}(\\mathbb{P}^1) \\cong \\mathbb{Z}\\) generated by any point.'
                },
                {
                    question: 'On an elliptic curve \\(E\\), show that \\([P] \\sim [Q]\\) if and only if \\(P = Q\\).',
                    hint: 'If \\([P] - [Q] = \\operatorname{div}(f)\\), what is the degree of \\(f\\)?',
                    solution: 'If \\([P] \\sim [Q]\\), there exists \\(f \\in k(E)^*\\) with \\(\\operatorname{div}(f) = [P] - [Q]\\). Then \\(f\\) has exactly one zero and one pole, so \\(f\\) is a rational function of degree 1 on \\(E\\). But a degree-1 map from a genus-1 curve to \\(\\mathbb{P}^1\\) would give \\(g(E) = g(\\mathbb{P}^1) = 0\\), contradiction. Hence \\(P = Q\\). This shows the degree map \\(\\operatorname{Cl}(E) \\to \\mathbb{Z}\\) has kernel \\(\\operatorname{Cl}^0(E) \\cong E\\) (the curve itself).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Line Bundles
        // ================================================================
        {
            id: 'sec-line-bundles',
            title: 'Line Bundles',
            content: `
<h2>Line Bundles</h2>

<div class="env-block definition">
    <div class="env-title">Definition 13.12 (Line Bundle / Invertible Sheaf)</div>
    <div class="env-body">
        <p>A <strong>line bundle</strong> (or <strong>invertible sheaf</strong>) on a scheme \\(X\\) is a locally free sheaf of \\(\\mathcal{O}_X\\)-modules of rank 1. Equivalently, it is a sheaf \\(\\mathcal{L}\\) such that there is an open cover \\(\\{U_i\\}\\) with \\(\\mathcal{L}|_{U_i} \\cong \\mathcal{O}_{U_i}\\) for each \\(i\\).</p>
    </div>
</div>

<p>The term "invertible" comes from the tensor product: \\(\\mathcal{L} \\otimes \\mathcal{L}^{-1} \\cong \\mathcal{O}_X\\), where \\(\\mathcal{L}^{-1} = \\mathcal{H}om(\\mathcal{L}, \\mathcal{O}_X)\\) is the dual sheaf.</p>

<h3>From Divisors to Line Bundles</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.13 (Divisor-Bundle Correspondence)</div>
    <div class="env-body">
        <p>On a smooth variety \\(X\\), there is a canonical isomorphism</p>
        \\[\\operatorname{Cl}(X) \\xrightarrow{\\sim} \\operatorname{Pic}(X), \\quad [D] \\mapsto [\\mathcal{O}_X(D)].\\]
        <p>The inverse sends an invertible sheaf \\(\\mathcal{L}\\) to the divisor of any nonzero rational section of \\(\\mathcal{L}\\).</p>
    </div>
</div>

<h3>Sections of \\(\\mathcal{O}(D)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 13.14 (The Riemann-Roch Space)</div>
    <div class="env-body">
        <p>For a divisor \\(D\\) on a smooth projective curve \\(C\\), the <strong>Riemann-Roch space</strong> is</p>
        \\[L(D) = H^0(C, \\mathcal{O}_C(D)) = \\{f \\in k(C)^* : \\operatorname{div}(f) + D \\geq 0\\} \\cup \\{0\\}.\\]
        <p>Its dimension is denoted \\(\\ell(D) = \\dim_k L(D)\\).</p>
    </div>
</div>

<p>The condition \\(\\operatorname{div}(f) + D \\geq 0\\) means: "\\(f\\) is allowed to have poles, but only where \\(D\\) has positive coefficients, and the pole order must not exceed the coefficient." This is the precise sense in which \\(D\\) "bounds the poles" of sections of \\(\\mathcal{O}(D)\\).</p>

<div class="env-block example">
    <div class="env-title">Example: \\(L(D)\\) on \\(\\mathbb{P}^1\\)</div>
    <div class="env-body">
        <p>On \\(\\mathbb{P}^1\\), let \\(D = n \\cdot [\\infty]\\) for \\(n \\geq 0\\). Then</p>
        \\[L(D) = \\{f \\in k(x) : f \\text{ has a pole of order } \\leq n \\text{ at } \\infty, \\text{no other poles}\\}.\\]
        <p>These are exactly the polynomials of degree \\(\\leq n\\). So \\(L(n[\\infty]) = \\{a_0 + a_1 x + \\cdots + a_n x^n\\}\\) and \\(\\ell(n[\\infty]) = n + 1\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Standard Line Bundles on \\(\\mathbb{P}^n\\)</div>
    <div class="env-body">
        <p>The sheaf \\(\\mathcal{O}_{\\mathbb{P}^n}(d) = \\mathcal{O}(dH)\\), where \\(H\\) is a hyperplane, has global sections \\(H^0(\\mathbb{P}^n, \\mathcal{O}(d))\\) equal to the space of homogeneous polynomials of degree \\(d\\) in \\(n+1\\) variables. So \\(h^0(\\mathcal{O}(d)) = \\binom{n+d}{n}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-line-bundle-sections"></div>
`,
            visualizations: [
                {
                    id: 'viz-line-bundle-sections',
                    title: 'Sections of \\(\\mathcal{O}(D)\\): Functions with Bounded Poles',
                    description: 'A section of \\(\\mathcal{O}(D)\\) is a rational function whose poles are bounded by \\(D\\). Choose a divisor \\(D = n \\cdot [\\infty]\\) on \\(\\mathbb{P}^1\\) and see the space of allowed functions (polynomials of degree \\(\\leq n\\)).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 240, scale: 40
                        });

                        var n = 2;
                        var coeffs = [1, 0.5, -0.3, 0, 0];

                        var nSlider = VizEngine.createSlider(controls, 'n (pole order)', 0, 4, n, 1, function(v) {
                            n = Math.round(v);
                            draw();
                        });

                        for (var ci = 0; ci < 5; ci++) {
                            (function(idx) {
                                VizEngine.createSlider(controls, 'a' + idx, -2, 2, coeffs[idx], 0.1, function(v) {
                                    coeffs[idx] = v;
                                    draw();
                                });
                            })(ci);
                        }

                        function evalPoly(x) {
                            var val = 0;
                            for (var i = 0; i <= n && i < coeffs.length; i++) {
                                val += coeffs[i] * Math.pow(x, i);
                            }
                            return val;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Grid and axes
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Draw the polynomial
                            viz.drawFunction(evalPoly, -3, 10, viz.colors.blue, 2.5);

                            // Info
                            var terms = [];
                            for (var i = 0; i <= n && i < coeffs.length; i++) {
                                var c = coeffs[i];
                                if (Math.abs(c) < 0.01) continue;
                                var term = c.toFixed(1);
                                if (i === 1) term += 'x';
                                else if (i > 1) term += 'x\u00B' + i;
                                terms.push(term);
                            }
                            var polyStr = terms.length > 0 ? terms.join(' + ').replace(/\+ -/g, '\u2212 ') : '0';

                            viz.screenText('D = ' + n + '\u00B7[\u221E]   \u21D2   L(D) = {polys of deg \u2264 ' + n + '}', viz.width / 2, 20, viz.colors.teal, 12);
                            viz.screenText('f(x) = ' + polyStr, viz.width / 2, 40, viz.colors.blue, 12);
                            viz.screenText('\u2113(D) = dim L(D) = ' + (n + 1), viz.width / 2, viz.height - 15, viz.colors.yellow, 13);

                            // Shade the "forbidden zone" beyond degree n
                            if (n < 4) {
                                viz.screenText('Coefficients a' + (n+1) + ',...,a4 are ignored (degree > n)', viz.width / 2, viz.height - 35, viz.colors.text, 10);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'On \\(\\mathbb{P}^1\\), compute \\(\\ell(D)\\) for \\(D = 2[0] + [1] - [\\infty]\\).',
                    hint: 'Find all \\(f \\in k(x)\\) with \\(\\operatorname{div}(f) + D \\geq 0\\). What poles and zeros does \\(f\\) need?',
                    solution: 'We need \\(\\operatorname{div}(f) + 2[0] + [1] - [\\infty] \\geq 0\\). So \\(f\\) may have a pole of order \\(\\leq 2\\) at \\(0\\), a pole of order \\(\\leq 1\\) at \\(1\\), and must have a zero of order \\(\\geq 1\\) at \\(\\infty\\) (to cancel the \\(-1\\)). Since \\(\\deg(D) = 2\\) and \\(D\\) is on \\(\\mathbb{P}^1\\) (genus 0), by Riemann-Roch \\(\\ell(D) = \\deg(D) + 1 - g = 2 + 1 - 0 = 3\\). Explicitly, \\(L(D)\\) has basis \\(\\{1/x, 1/x^2, 1/(x(x-1))\\}\\)... but more carefully: \\(D \\sim 2[\\infty]\\) (since all degree-2 divisors on \\(\\mathbb{P}^1\\) are linearly equivalent), so \\(\\ell(D) = 3\\).'
                },
                {
                    question: 'Why is \\(\\ell(D) = 0\\) when \\(\\deg(D) < 0\\) on a smooth projective curve?',
                    hint: 'If \\(f \\in L(D)\\) is nonzero, what can you say about \\(\\deg(\\operatorname{div}(f) + D)\\)?',
                    solution: 'If \\(0 \\neq f \\in L(D)\\), then \\(\\operatorname{div}(f) + D \\geq 0\\) is an effective divisor, so \\(\\deg(\\operatorname{div}(f) + D) \\geq 0\\). But \\(\\deg(\\operatorname{div}(f)) = 0\\) (principal divisors have degree 0), so \\(\\deg(D) \\geq 0\\). Contrapositive: if \\(\\deg(D) < 0\\), no nonzero \\(f\\) exists, hence \\(L(D) = \\{0\\}\\) and \\(\\ell(D) = 0\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Linear Systems
        // ================================================================
        {
            id: 'sec-linear-systems',
            title: 'Linear Systems',
            content: `
<h2>Linear Systems</h2>

<div class="env-block definition">
    <div class="env-title">Definition 13.15 (Complete Linear System)</div>
    <div class="env-body">
        <p>The <strong>complete linear system</strong> of a divisor \\(D\\) on \\(X\\) is</p>
        \\[|D| = \\{D' \\geq 0 : D' \\sim D\\} = \\{\\operatorname{div}(f) + D : f \\in L(D), f \\neq 0\\}.\\]
        <p>As a set, \\(|D|\\) is naturally identified with the projective space \\(\\mathbb{P}(L(D)) \\cong \\mathbb{P}^{\\ell(D)-1}\\).</p>
    </div>
</div>

<p>The identification works as follows: two functions \\(f, g \\in L(D) \\setminus \\{0\\}\\) give the same effective divisor \\(\\operatorname{div}(f) + D = \\operatorname{div}(g) + D\\) if and only if \\(\\operatorname{div}(f/g) = 0\\), i.e., \\(f/g\\) is a nonzero constant. So elements of \\(|D|\\) correspond to lines through the origin in \\(L(D)\\), which is exactly \\(\\mathbb{P}(L(D))\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Conics Through Points</div>
    <div class="env-body">
        <p>On \\(\\mathbb{P}^2\\), the linear system \\(|2H|\\) parametrizes all conics (degree-2 curves). Since \\(L(2H)\\) is the space of degree-2 homogeneous polynomials in \\(X, Y, Z\\), which has dimension \\(\\binom{4}{2} = 6\\), we get \\(|2H| \\cong \\mathbb{P}^5\\). Each point of \\(\\mathbb{P}^5\\) corresponds to a conic \\(aX^2 + bY^2 + cZ^2 + dXY + eXZ + fYZ = 0\\).</p>
    </div>
</div>

<h3>Maps to Projective Space</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.16 (Maps from Linear Systems)</div>
    <div class="env-body">
        <p>Let \\(D\\) be a divisor on a smooth projective variety \\(X\\) with \\(\\ell(D) = r + 1 \\geq 1\\). Choose a basis \\(f_0, \\ldots, f_r\\) of \\(L(D)\\). Then the map</p>
        \\[\\varphi_{|D|}: X \\dashrightarrow \\mathbb{P}^r, \\quad x \\mapsto [f_0(x) : \\cdots : f_r(x)]\\]
        <p>is a well-defined rational map. If \\(D\\) is <strong>base-point-free</strong> (i.e., for every \\(x \\in X\\), there exists \\(f \\in L(D)\\) with \\(f(x) \\neq 0\\)), then \\(\\varphi_{|D|}\\) is a morphism (defined everywhere).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 13.17 (Very Ample, Ample)</div>
    <div class="env-body">
        <p>A divisor \\(D\\) is <strong>very ample</strong> if \\(\\varphi_{|D|}\\) is a closed embedding. \\(D\\) is <strong>ample</strong> if some positive multiple \\(nD\\) is very ample.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Veronese and Segre Embeddings</div>
    <div class="env-body">
        <p><strong>Veronese:</strong> On \\(\\mathbb{P}^1\\), the divisor \\(D = d \\cdot [\\infty]\\) gives the map \\([s:t] \\mapsto [s^d : s^{d-1}t : \\cdots : t^d]\\), embedding \\(\\mathbb{P}^1\\) as the rational normal curve of degree \\(d\\) in \\(\\mathbb{P}^d\\).</p>
        <p><strong>Segre:</strong> On \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\), the divisor \\(D = H_1 + H_2\\) (where \\(H_i\\) is a "horizontal" or "vertical" line) gives the Segre embedding into \\(\\mathbb{P}^3\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-linear-system-map"></div>
`,
            visualizations: [
                {
                    id: 'viz-linear-system-map',
                    title: 'Linear System Map: \\(\\mathbb{P}^1 \\to \\mathbb{P}^d\\)',
                    description: 'The complete linear system \\(|d \\cdot [\\infty]|\\) on \\(\\mathbb{P}^1\\) gives the Veronese embedding: \\([s:t] \\mapsto [s^d : s^{d-1}t : \\cdots : t^d]\\). For \\(d=2\\), this is a conic in \\(\\mathbb{P}^2\\); for \\(d=3\\), a twisted cubic in \\(\\mathbb{P}^3\\) (projected to the screen). The animation traces the image curve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 190, scale: 100
                        });

                        var degree = 2;
                        var time = 0;
                        var animating = true;

                        VizEngine.createSlider(controls, 'Degree d', 2, 5, degree, 1, function(v) {
                            degree = Math.round(v);
                        });
                        var animBtn = VizEngine.createButton(controls, 'Pause', function() {
                            animating = !animating;
                            animBtn.textContent = animating ? 'Pause' : 'Play';
                        });

                        function veronese(theta, d) {
                            // Parametrize P^1 by angle theta, project to 2D for display
                            var s = Math.cos(theta), t = Math.sin(theta);
                            var coords = [];
                            for (var k = 0; k <= d; k++) {
                                coords.push(Math.pow(s, d - k) * Math.pow(t, k));
                            }
                            // Project to 2D using first 3 coords (or 2 if d=1)
                            if (d === 1) return [coords[0], coords[1]];
                            // Stereographic-style projection from higher dim
                            var x = coords[1]; // s^{d-1}t
                            var y = coords[2]; // s^{d-2}t^2
                            if (d >= 3) {
                                // Add a rotation to show 3D structure
                                var z = coords[3] || 0;
                                var angle = time * 0.0005;
                                var xr = x * Math.cos(angle) - z * Math.sin(angle);
                                var yr = y;
                                return [xr * 2, yr * 2];
                            }
                            return [x * 2, y * 2];
                        }

                        viz.animate(function(t) {
                            if (animating) time = t;
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('Veronese: \u2119\u00B9 \u2192 \u2119' + degree + '  (d = ' + degree + ')', viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('\u2113(d\u00B7[\u221E]) = d + 1 = ' + (degree + 1) + ' basis sections', viz.width / 2, 38, viz.colors.teal, 11);

                            // Draw axes
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(0, viz.originY); ctx.lineTo(viz.width, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, 0); ctx.lineTo(viz.originX, viz.height); ctx.stroke();

                            // Draw the image curve
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var steps = 500;
                            for (var i = 0; i <= steps; i++) {
                                var theta = -Math.PI + 2 * Math.PI * i / steps;
                                var pt = veronese(theta, degree);
                                var sx = viz.originX + pt[0] * viz.scale;
                                var sy = viz.originY - pt[1] * viz.scale;
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Trace point
                            var traceAngle = time * 0.001;
                            var tracePt = veronese(traceAngle, degree);
                            var tsx = viz.originX + tracePt[0] * viz.scale;
                            var tsy = viz.originY - tracePt[1] * viz.scale;

                            ctx.fillStyle = viz.colors.orange + '44';
                            ctx.beginPath(); ctx.arc(tsx, tsy, 10, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(tsx, tsy, 5, 0, Math.PI * 2); ctx.fill();

                            // Source P^1 representation (small circle at top-right)
                            var srcCx = viz.width - 70, srcCy = 100, srcR = 30;
                            ctx.strokeStyle = viz.colors.white + '66';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.arc(srcCx, srcCy, srcR, 0, Math.PI * 2);
                            ctx.stroke();
                            viz.screenText('\u2119\u00B9', srcCx, srcCy - srcR - 10, viz.colors.white + '88', 10);

                            // Point on source
                            var srcPx = srcCx + srcR * Math.cos(traceAngle);
                            var srcPy = srcCy - srcR * Math.sin(traceAngle);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(srcPx, srcPy, 4, 0, Math.PI * 2); ctx.fill();

                            // Label
                            if (degree === 2) {
                                viz.screenText('Image: conic in \u2119\u00B2', viz.width / 2, viz.height - 20, viz.colors.text, 11);
                            } else if (degree === 3) {
                                viz.screenText('Image: twisted cubic in \u2119\u00B3 (projected)', viz.width / 2, viz.height - 20, viz.colors.text, 11);
                            } else {
                                viz.screenText('Image: rational normal curve of degree ' + degree + ' (projected)', viz.width / 2, viz.height - 20, viz.colors.text, 11);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(|D|\\) is empty if and only if \\(\\ell(D) = 0\\).',
                    hint: 'What does it mean for \\(|D|\\) to have an element?',
                    solution: '\\(|D|\\) has an element iff there exists \\(D\' \\geq 0\\) with \\(D\' \\sim D\\), iff there exists \\(f \\in k(X)^*\\) with \\(\\operatorname{div}(f) + D \\geq 0\\), iff \\(L(D) \\neq \\{0\\}\\), iff \\(\\ell(D) \\geq 1\\). So \\(|D| = \\emptyset \\Leftrightarrow \\ell(D) = 0\\).'
                },
                {
                    question: 'On \\(\\mathbb{P}^2\\), what is the dimension of the linear system of cubics passing through two given points \\(P, Q\\)?',
                    hint: 'Start with \\(\\dim |3H| = \\binom{5}{2} - 1 = 9\\). Each point imposes one linear condition.',
                    solution: 'The space of cubics in \\(\\mathbb{P}^2\\) has dimension \\(\\binom{5}{2} = 10\\), so \\(|3H| \\cong \\mathbb{P}^9\\). Requiring passage through a point \\(P\\) imposes one linear condition (generically independent), so cubics through \\(P\\) form a \\(\\mathbb{P}^8\\). Two points impose two independent conditions (since no cubic is forced by two points), giving a \\(\\mathbb{P}^7\\). The linear system has dimension 7.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Bridge',
            content: `
<h2>The Bridge: Divisors, Sheaves, and Geometry</h2>

<div class="env-block intuition">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>We have built a chain of correspondences that connects three quite different worlds:</p>
        <ol>
            <li><strong>Combinatorial/geometric:</strong> Weil divisors (formal sums of subvarieties)</li>
            <li><strong>Algebraic:</strong> Cartier divisors / invertible sheaves (transition functions, local equations)</li>
            <li><strong>Function-theoretic:</strong> linear systems \\(|D|\\) and maps to projective space</li>
        </ol>
        <p>On a smooth variety, all three perspectives are equivalent, and moving between them is one of the central techniques of algebraic geometry.</p>
    </div>
</div>

<h3>The Correspondence Table</h3>

<div class="env-block remark">
    <div class="env-title">Dictionary</div>
    <div class="env-body">
        <table style="width:100%;border-collapse:collapse;font-size:0.92em;">
        <tr style="border-bottom:1px solid #30363d;">
            <th style="text-align:left;padding:4px 8px;">Divisors</th>
            <th style="text-align:left;padding:4px 8px;">Sheaves</th>
            <th style="text-align:left;padding:4px 8px;">Geometry</th>
        </tr>
        <tr><td style="padding:4px 8px;">\\(D\\) (Weil divisor)</td><td style="padding:4px 8px;">\\(\\mathcal{O}_X(D)\\) (invertible sheaf)</td><td style="padding:4px 8px;">codim-1 subvariety with multiplicities</td></tr>
        <tr><td style="padding:4px 8px;">\\(D \\geq 0\\) (effective)</td><td style="padding:4px 8px;">\\(\\mathcal{O}_X \\hookrightarrow \\mathcal{O}_X(D)\\)</td><td style="padding:4px 8px;">actual subvariety (no poles)</td></tr>
        <tr><td style="padding:4px 8px;">\\(D \\sim D'\\) (linear equiv.)</td><td style="padding:4px 8px;">\\(\\mathcal{O}(D) \\cong \\mathcal{O}(D')\\)</td><td style="padding:4px 8px;">same map to \\(\\mathbb{P}^n\\)</td></tr>
        <tr><td style="padding:4px 8px;">\\(L(D)\\)</td><td style="padding:4px 8px;">\\(H^0(X, \\mathcal{O}(D))\\)</td><td style="padding:4px 8px;">functions with bounded poles</td></tr>
        <tr><td style="padding:4px 8px;">\\(|D|\\)</td><td style="padding:4px 8px;">\\(\\mathbb{P}(H^0(\\mathcal{O}(D)))\\)</td><td style="padding:4px 8px;">family of effective divisors</td></tr>
        <tr><td style="padding:4px 8px;">\\(D\\) very ample</td><td style="padding:4px 8px;">\\(\\mathcal{O}(D)\\) very ample</td><td style="padding:4px 8px;">\\(\\varphi_{|D|}\\) is an embedding</td></tr>
        <tr><td style="padding:4px 8px;">\\(\\operatorname{Cl}(X)\\)</td><td style="padding:4px 8px;">\\(\\operatorname{Pic}(X)\\)</td><td style="padding:4px 8px;">global invariant of \\(X\\)</td></tr>
        </table>
    </div>
</div>

<h3>The Picard Group of an Elliptic Curve</h3>

<p>For an elliptic curve \\(E\\) with a chosen origin \\(O\\), the degree map gives an exact sequence</p>
\\[0 \\to \\operatorname{Pic}^0(E) \\to \\operatorname{Pic}(E) \\xrightarrow{\\deg} \\mathbb{Z} \\to 0.\\]

<p>The remarkable fact is that \\(\\operatorname{Pic}^0(E) \\cong E\\) as a group: the map \\(P \\mapsto [P] - [O]\\) identifies points of \\(E\\) with degree-0 divisor classes. The group law on \\(E\\) (defined by the chord-tangent construction) is exactly the addition of divisor classes. This is the genesis of the theory of abelian varieties.</p>

<h3>Looking Ahead</h3>

<p>The theory of divisors feeds directly into three of the deepest results in algebraic geometry:</p>
<ul>
    <li><strong>Riemann-Roch (Chapter 16):</strong> \\(\\ell(D) - \\ell(K - D) = \\deg(D) + 1 - g\\), computing \\(\\ell(D)\\) in terms of degree, genus, and the canonical divisor \\(K\\).</li>
    <li><strong>Serre duality (Chapter 15):</strong> \\(H^1(\\mathcal{O}(D)) \\cong H^0(\\mathcal{O}(K-D))^\\vee\\), connecting cohomology groups.</li>
    <li><strong>The canonical embedding (Chapter 14):</strong> the linear system \\(|K|\\) of the canonical divisor embeds non-hyperelliptic curves into projective space.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-picard-group"></div>
`,
            visualizations: [
                {
                    id: 'viz-picard-group',
                    title: 'Pic\u2070(E): The Elliptic Curve is its Own Picard Group',
                    description: 'On an elliptic curve \\(E\\), every degree-0 divisor class \\([P] - [O]\\) corresponds to a point \\(P \\in E\\). The group law on \\(E\\) (chord-tangent) matches addition of divisor classes. Click two points to see their sum.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 220, scale: 55
                        });

                        // Elliptic curve y^2 = x^3 - x + 1
                        var a = -1, b = 1;

                        function curveY(x) {
                            var val = x * x * x + a * x + b;
                            return val >= 0 ? Math.sqrt(val) : NaN;
                        }

                        // Points
                        var P = { x: -0.8, upper: true };
                        var Q = { x: 0.5, upper: true };

                        function getY(pt) {
                            var y = curveY(pt.x);
                            return pt.upper ? y : -y;
                        }

                        function addPoints(p1x, p1y, p2x, p2y) {
                            // Elliptic curve addition on y^2 = x^3 + ax + b
                            var m;
                            if (Math.abs(p1x - p2x) < 1e-10) {
                                if (Math.abs(p1y - p2y) < 1e-10) {
                                    // Tangent
                                    if (Math.abs(p1y) < 1e-10) return null;
                                    m = (3 * p1x * p1x + a) / (2 * p1y);
                                } else {
                                    return null; // point at infinity
                                }
                            } else {
                                m = (p2y - p1y) / (p2x - p1x);
                            }
                            var x3 = m * m - p1x - p2x;
                            var y3 = m * (p1x - x3) - p1y;
                            return { x: x3, y: -y3 }; // negate for group law
                        }

                        var pDrag = viz.addDraggable('P', P.x, getY(P), viz.colors.blue, 7, function(wx) {
                            P.x = Math.max(-1.4, Math.min(3, wx));
                            var y = curveY(P.x);
                            if (!isNaN(y)) {
                                pDrag.y = P.upper ? y : -y;
                            }
                        });

                        var qDrag = viz.addDraggable('Q', Q.x, getY(Q), viz.colors.teal, 7, function(wx) {
                            Q.x = Math.max(-1.4, Math.min(3, wx));
                            var y = curveY(Q.x);
                            if (!isNaN(y)) {
                                qDrag.y = Q.upper ? y : -y;
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Grid
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Draw curve
                            ctx.strokeStyle = viz.colors.white + '55';
                            ctx.lineWidth = 2;
                            // Upper branch
                            ctx.beginPath();
                            var started = false;
                            for (var i = -150; i <= 300; i++) {
                                var x = i / 50;
                                var y = curveY(x);
                                if (isNaN(y)) { started = false; continue; }
                                var s = viz.toScreen(x, y);
                                if (!started) { ctx.moveTo(s[0], s[1]); started = true; }
                                else ctx.lineTo(s[0], s[1]);
                            }
                            ctx.stroke();
                            // Lower branch
                            ctx.beginPath();
                            started = false;
                            for (var i = -150; i <= 300; i++) {
                                var x = i / 50;
                                var y = curveY(x);
                                if (isNaN(y)) { started = false; continue; }
                                var s = viz.toScreen(x, -y);
                                if (!started) { ctx.moveTo(s[0], s[1]); started = true; }
                                else ctx.lineTo(s[0], s[1]);
                            }
                            ctx.stroke();

                            // Compute P + Q
                            var py = pDrag.y, qy = qDrag.y;
                            var result = addPoints(pDrag.x, py, qDrag.x, qy);

                            if (result) {
                                // Draw chord line
                                var m = (qy - py) / (qDrag.x - pDrag.x);
                                if (Math.abs(qDrag.x - pDrag.x) < 1e-8) m = 1e6;
                                var lineFunc = function(x) { return py + m * (x - pDrag.x); };
                                viz.drawFunction(lineFunc, -4, 6, viz.colors.yellow + '44', 1);

                                // Third intersection point (before reflection)
                                var rx = result.x, ry = -result.y;
                                var sr = viz.toScreen(rx, ry);
                                ctx.fillStyle = viz.colors.purple + '44';
                                ctx.beginPath(); ctx.arc(sr[0], sr[1], 5, 0, Math.PI * 2); ctx.fill();

                                // Vertical line (reflection)
                                ctx.strokeStyle = viz.colors.purple + '44';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([3, 3]);
                                var st = viz.toScreen(rx, result.y);
                                ctx.beginPath(); ctx.moveTo(sr[0], sr[1]); ctx.lineTo(st[0], st[1]); ctx.stroke();
                                ctx.setLineDash([]);

                                // Result point P+Q
                                ctx.fillStyle = viz.colors.orange + '44';
                                ctx.beginPath(); ctx.arc(st[0], st[1], 10, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(st[0], st[1], 6, 0, Math.PI * 2); ctx.fill();
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('P+Q', st[0] + 10, st[1] - 8);
                            }

                            // Draw P and Q
                            viz.drawDraggables();
                            var sp = viz.toScreen(pDrag.x, py);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('P', sp[0], sp[1] - 14);

                            var sq = viz.toScreen(qDrag.x, qy);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Q', sq[0], sq[1] - 14);

                            // Info
                            viz.screenText('y\u00B2 = x\u00B3 \u2212 x + 1', viz.width - 80, 20, viz.colors.white + 'aa', 11);
                            viz.screenText('Pic\u2070(E) \u2245 E:  [P]\u2212[O] + [Q]\u2212[O] = [P+Q]\u2212[O]', viz.width / 2, viz.height - 20, viz.colors.yellow, 11);
                            viz.screenText('Drag P and Q on the curve', viz.width / 2, viz.height - 5, viz.colors.text, 10);
                        }

                        viz.animate(function() { draw(); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\operatorname{Pic}(\\mathbb{P}^1 \\times \\mathbb{P}^1)\\).',
                    hint: 'Use the fact that \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\) is smooth, and consider the classes of a "horizontal" and "vertical" line.',
                    solution: '\\(\\operatorname{Pic}(\\mathbb{P}^1 \\times \\mathbb{P}^1) \\cong \\mathbb{Z} \\times \\mathbb{Z}\\), generated by the classes \\(H_1 = \\{\\text{pt}\\} \\times \\mathbb{P}^1\\) and \\(H_2 = \\mathbb{P}^1 \\times \\{\\text{pt}\\}\\). A divisor of bidegree \\((a,b)\\) corresponds to \\(aH_1 + bH_2\\). This can be proved using the exact sequence from the inclusion of an open affine chart.'
                },
                {
                    question: 'On an elliptic curve \\(E\\) with origin \\(O\\), show that the map \\(\\sigma: E \\to \\operatorname{Pic}^0(E)\\) given by \\(P \\mapsto [P] - [O]\\) is a bijection.',
                    hint: 'For surjectivity, use the fact that every degree-0 divisor on \\(E\\) is linearly equivalent to \\([P] - [O]\\) for some \\(P\\). For injectivity, use the fact that \\([P] \\sim [Q]\\) implies \\(P = Q\\) on an elliptic curve.',
                    solution: '<strong>Surjectivity:</strong> Given a degree-0 divisor class \\([D]\\) with \\(\\deg(D) = 0\\), consider \\(D + [O]\\), which has degree 1. By Riemann-Roch on a genus-1 curve, \\(\\ell(D + [O]) = 1\\), so there exists \\(f\\) with \\(\\operatorname{div}(f) + D + [O] \\geq 0\\). Since this effective divisor has degree 1, it is a single point \\([P]\\). So \\(D \\sim [P] - [O]\\). <strong>Injectivity:</strong> If \\([P] - [O] \\sim [Q] - [O]\\), then \\([P] \\sim [Q]\\), and as shown in a previous exercise, this forces \\(P = Q\\) on a genus-1 curve.'
                },
                {
                    question: 'Let \\(C\\) be a smooth projective curve of genus 2 and \\(K\\) its canonical divisor. Show that \\(|K|\\) maps \\(C\\) to \\(\\mathbb{P}^1\\) as a degree-2 cover (i.e., \\(C\\) is hyperelliptic).',
                    hint: 'By Riemann-Roch, compute \\(\\ell(K)\\) and \\(\\deg(K)\\).',
                    solution: 'For genus \\(g = 2\\): \\(\\deg(K) = 2g - 2 = 2\\) and \\(\\ell(K) = g = 2\\) (by Riemann-Roch: \\(\\ell(K) - \\ell(0) = \\deg(K) + 1 - g\\), i.e., \\(\\ell(K) - 1 = 2 + 1 - 2 = 1\\), so \\(\\ell(K) = 2\\)). The linear system \\(|K|\\) is a \\(\\mathbb{P}^1\\), and \\(\\varphi_{|K|}: C \\to \\mathbb{P}^1\\) is a map of degree \\(\\deg(K) = 2\\). Every genus-2 curve is hyperelliptic.'
                }
            ]
        }
    ]
});
