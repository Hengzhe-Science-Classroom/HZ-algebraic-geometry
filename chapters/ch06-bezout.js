window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: "Bezout's Theorem & Intersections",
    subtitle: 'Counting intersections with multiplicity',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Intersections?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Two curves in the plane typically meet in finitely many points. How many? A line meets a circle in at most 2 points, a line meets a cubic in at most 3, and two conics meet in at most 4. Is there a general pattern?</p>
        <p>The answer is one of the most beautiful results in algebraic geometry: the number of intersection points, <em>counted with the right multiplicities and in the right ambient space</em>, equals the product of the degrees.</p>
    </div>
</div>

<p>Intersection theory is the backbone of enumerative algebraic geometry. Questions like "how many lines lie on a cubic surface?" or "how many conics pass through 5 points?" ultimately reduce to intersection counting. Bezout's theorem is the starting point for all of this.</p>

<p>But to make Bezout's theorem actually <em>true</em> (not just "at most"), we need three ingredients:</p>
<ol>
    <li><strong>Work over \\(\\mathbb{C}\\)</strong> (or any algebraically closed field), so polynomials have all their roots.</li>
    <li><strong>Work in projective space \\(\\mathbb{P}^2\\)</strong>, so parallel lines meet at infinity.</li>
    <li><strong>Count with multiplicity</strong>, so tangencies are not undercounted.</li>
</ol>

<p>We have already developed the first two ingredients in Chapters 4 and 5. This chapter develops the third: intersection multiplicity.</p>

<h3>A First Example</h3>

<p>Consider the line \\(y = 0\\) and the parabola \\(y = x^2\\). They meet only at the origin. Yet the line has degree 1 and the parabola has degree 2, so Bezout predicts \\(1 \\times 2 = 2\\) intersections. Where is the missing point?</p>

<p>The answer is that the origin counts <em>twice</em>: the line is tangent to the parabola there. The intersection multiplicity at the origin is 2, not 1. We will make this precise shortly.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Etienne Bezout stated his theorem in 1779, but the first rigorous proof came much later. Making "intersection multiplicity" precise required ideas that took over a century to develop fully, from the resultant (Sylvester, 1840s) to local algebra (Serre, 1950s). The version we present follows the classical approach via resultants, which is both elementary and computationally effective.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-bezout-demo"></div>
`,
            visualizations: [
                {
                    id: 'viz-bezout-demo',
                    title: "Bezout's Theorem Demo",
                    description: 'Two algebraic curves intersecting. Intersection points are shown with their multiplicities. Adjust the curve degrees to see how the total count changes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, scale: 50 });
                        // Curve choices: 0 = line, 1 = conic, 2 = cubic
                        var deg1 = 1, deg2 = 2;

                        VizEngine.createSlider(controls, 'Degree C1', 1, 3, deg1, 1, function(v) {
                            deg1 = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'Degree C2', 1, 3, deg2, 1, function(v) {
                            deg2 = Math.round(v); draw();
                        });

                        // Predefined curves for each degree
                        function getCurve(deg, idx) {
                            if (deg === 1) return { f: function(x) { return 0.5 * x + 0.3; }, label: 'y = 0.5x+0.3', deg: 1 };
                            if (deg === 2) return { f: function(x) { return x * x - 2; }, label: 'y = x^2 - 2', deg: 2 };
                            return { f: function(x) { return 0.3 * x * x * x - 1.5 * x; }, label: 'y = 0.3x^3 - 1.5x', deg: 3 };
                        }

                        function findIntersections(f1, f2, lo, hi, steps) {
                            var pts = [];
                            var dx = (hi - lo) / steps;
                            for (var i = 0; i < steps; i++) {
                                var x0 = lo + i * dx, x1 = lo + (i + 1) * dx;
                                var d0 = f1(x0) - f2(x0), d1 = f1(x1) - f2(x1);
                                if (d0 * d1 <= 0 && isFinite(d0) && isFinite(d1)) {
                                    // bisect
                                    var a = x0, b = x1;
                                    for (var j = 0; j < 30; j++) {
                                        var m = (a + b) / 2;
                                        var dm = f1(m) - f2(m);
                                        if (dm * (f1(a) - f2(a)) <= 0) b = m; else a = m;
                                    }
                                    var xr = (a + b) / 2;
                                    // check multiplicity: if derivative difference is also near zero, mult >= 2
                                    var eps = 0.001;
                                    var dd1 = ((f1(xr+eps)-f2(xr+eps)) - (f1(xr-eps)-f2(xr-eps))) / (2*eps);
                                    var mult = Math.abs(dd1) < 0.15 ? 2 : 1;
                                    // check for triple: second derivative test
                                    if (mult === 2) {
                                        var dd2 = ((f1(xr+eps)-f2(xr+eps)) - 2*(f1(xr)-f2(xr)) + (f1(xr-eps)-f2(xr-eps))) / (eps*eps);
                                        if (Math.abs(dd2) < 0.5) mult = 3;
                                    }
                                    // avoid duplicates
                                    var dup = false;
                                    for (var k = 0; k < pts.length; k++) {
                                        if (Math.abs(pts[k].x - xr) < 0.05) { dup = true; break; }
                                    }
                                    if (!dup) pts.push({ x: xr, y: f1(xr), mult: mult });
                                }
                            }
                            return pts;
                        }

                        function draw() {
                            viz.clear(); viz.drawGrid(); viz.drawAxes();
                            var c1 = getCurve(deg1, 0), c2 = getCurve(deg2, 1);
                            var xMin = -viz.originX / viz.scale, xMax = (viz.width - viz.originX) / viz.scale;

                            viz.drawFunction(c1.f, xMin, xMax, viz.colors.blue, 2.5);
                            viz.drawFunction(c2.f, xMin, xMax, viz.colors.orange, 2.5);

                            var pts = findIntersections(c1.f, c2.f, xMin, xMax, 2000);
                            var totalMult = 0;
                            for (var i = 0; i < pts.length; i++) {
                                var p = pts[i];
                                totalMult += p.mult;
                                var col = p.mult > 1 ? viz.colors.red : viz.colors.green;
                                viz.drawPoint(p.x, p.y, col, 'm=' + p.mult, p.mult > 1 ? 7 : 5);
                            }

                            var ctx = viz.ctx;
                            // Legend
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('C1: deg ' + deg1, 12, 20);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('C2: deg ' + deg2, 12, 38);
                            ctx.fillStyle = viz.colors.white;
                            ctx.textAlign = 'center';
                            ctx.fillText('Bezout predicts: ' + deg1 + ' x ' + deg2 + ' = ' + (deg1 * deg2) + '   |   Found (real, visible): ' + totalMult, viz.width / 2, viz.height - 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Intersection Multiplicity
        // ================================================================
        {
            id: 'sec-intersection-multiplicity',
            title: 'Intersection Multiplicity',
            content: `
<h2>Intersection Multiplicity</h2>

<div class="env-block intuition">
    <div class="env-title">The Core Idea</div>
    <div class="env-body">
        <p>When two curves meet transversally (crossing each other at an angle), the intersection "feels like" one point. When they are tangent, the intersection "feels like" multiple points that have coalesced. Intersection multiplicity makes this precise: it counts how many transversal intersections have merged into one.</p>
    </div>
</div>

<p>Let \\(C_1 = V(F)\\) and \\(C_2 = V(G)\\) be two plane curves with no common component, and let \\(p\\) be a point in \\(C_1 \\cap C_2\\). We want to assign a positive integer \\(I_p(C_1, C_2)\\), the <strong>intersection multiplicity</strong> of \\(C_1\\) and \\(C_2\\) at \\(p\\).</p>

<h3>The Local Algebra Definition</h3>

<div class="env-block definition">
    <div class="env-title">Definition 6.1 (Intersection Multiplicity)</div>
    <div class="env-body">
        <p>Let \\(F, G \\in k[x,y]\\) have no common factor. The <strong>intersection multiplicity</strong> of \\(V(F)\\) and \\(V(G)\\) at a point \\(p = (a,b)\\) is</p>
        \\[I_p(F, G) = \\dim_k \\frac{\\mathcal{O}_{\\mathbb{A}^2, p}}{(F, G)}\\]
        <p>where \\(\\mathcal{O}_{\\mathbb{A}^2, p}\\) is the local ring of \\(\\mathbb{A}^2\\) at \\(p\\), i.e., the localization of \\(k[x,y]\\) at the maximal ideal \\(\\mathfrak{m}_p = (x-a, y-b)\\).</p>
    </div>
</div>

<p>This definition may look abstract, but it captures exactly the right notion. Let us unpack it through properties that the intersection multiplicity must satisfy.</p>

<h3>Key Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.2 (Properties of Intersection Multiplicity)</div>
    <div class="env-body">
        <p>The intersection multiplicity \\(I_p(F, G)\\) satisfies:</p>
        <ol>
            <li>\\(I_p(F, G) \\geq 1\\), with equality if and only if \\(F\\) and \\(G\\) have distinct tangent directions at \\(p\\) (transversal intersection).</li>
            <li>\\(I_p(F, G) = I_p(G, F)\\) (symmetry).</li>
            <li>\\(I_p(F, GH) = I_p(F, G) + I_p(F, H)\\) (additivity).</li>
            <li>\\(I_p(F, G) = I_p(F, G + HF)\\) for any polynomial \\(H\\) (invariance under curve modification).</li>
            <li>If \\(F = x\\) and \\(G = y^m\\), then \\(I_0(F, G) = m\\).</li>
        </ol>
    </div>
</div>

<p>Property (1) is the crucial one: <strong>transversal intersections have multiplicity 1</strong>. When the curves are tangent, the multiplicity is at least 2.</p>

<h3>Computing Multiplicity in Practice</h3>

<p>For explicit computation, we can often avoid the abstract local ring definition. If \\(p\\) is the origin and one of the curves is \\(V(y - f(x))\\) for some polynomial or power series \\(f\\), then:</p>

\\[I_0(y - f(x),\\, G) = \\operatorname{ord}_x G(x, f(x))\\]

<p>That is, substitute the parametrization of one curve into the equation of the other, and count the order of vanishing at \\(x = 0\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Line Tangent to a Conic</div>
    <div class="env-body">
        <p>Let \\(F = y\\) (the \\(x\\)-axis) and \\(G = y - x^2\\) (a parabola). At the origin:</p>
        \\[G(x, 0) = 0 - x^2 = -x^2\\]
        <p>The order of vanishing is 2, so \\(I_0(F, G) = 2\\). The line is tangent to the parabola.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Two Conics</div>
    <div class="env-body">
        <p>Let \\(F = x^2 + y^2 - 1\\) (unit circle) and \\(G = (x-1)^2 + y^2 - 1\\) (circle centered at \\((1,0)\\)). Subtracting: \\(F - G = x^2 - (x-1)^2 = 2x - 1\\). So the circles meet where \\(x = 1/2\\), giving \\(y = \\pm\\sqrt{3}/2\\). At each point, the circles cross transversally, so each intersection has multiplicity 1. Total: 2 points, total multiplicity 2, matching \\(\\deg F \\cdot \\deg G = 2 \\times 2 = 4\\)... but wait, that is only 2, not 4!</p>
        <p>The missing intersections are at infinity. Homogenizing and checking: the two circles are tangent to the "line at infinity" at the <strong>circular points</strong> \\([1 : i : 0]\\) and \\([1 : -i : 0]\\), each with multiplicity 1. Total: \\(2 + 1 + 1 = 4 = 2 \\times 2\\). Bezout is satisfied.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-tangent-intersection"></div>
<div class="viz-placeholder" data-viz="viz-line-meets-cubic"></div>
`,
            visualizations: [
                {
                    id: 'viz-tangent-intersection',
                    title: 'Tangent vs Transversal Intersection',
                    description: 'Two conics intersecting. When they are tangent at a point, the multiplicity is 2 (shown in red). When they cross transversally, the multiplicity is 1 (shown in green). Drag to adjust.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, scale: 60 });
                        var cx2 = 1.5;

                        var dragger = viz.addDraggable('center2', cx2, 0, viz.colors.orange, 8, function(x, y) {
                            cx2 = x;
                            dragger.y = 0; // constrain to x-axis
                            draw();
                        });

                        function drawImplicit(viz, F, xMin, xMax, yMin, yMax, color, lw, step) {
                            var ctx = viz.ctx;
                            step = step || 0.03;
                            ctx.fillStyle = color;
                            for (var x = xMin; x <= xMax; x += step) {
                                for (var y = yMin; y <= yMax; y += step) {
                                    var v = F(x, y);
                                    if (Math.abs(v) < step * 2.5) {
                                        var sx = viz.originX + x * viz.scale;
                                        var sy = viz.originY - y * viz.scale;
                                        ctx.fillRect(sx - 0.8, sy - 0.8, 1.6, 1.6);
                                    }
                                }
                            }
                        }

                        function draw() {
                            viz.clear(); viz.drawGrid(); viz.drawAxes();
                            var xMin = -viz.originX / viz.scale, xMax = (viz.width - viz.originX) / viz.scale;
                            var yMin = -(viz.height - viz.originY) / viz.scale, yMax = viz.originY / viz.scale;

                            // Circle 1: x^2 + y^2 = 1
                            var F = function(x, y) { return x*x + y*y - 1; };
                            // Circle 2: (x-cx2)^2 + y^2 = 1
                            var G = function(x, y) { return (x-cx2)*(x-cx2) + y*y - 1; };

                            drawImplicit(viz, F, xMin, xMax, yMin, yMax, viz.colors.blue, 2, 0.02);
                            drawImplicit(viz, G, xMin, xMax, yMin, yMax, viz.colors.orange, 2, 0.02);

                            // Find real intersections
                            // From F - G = 0: x^2 - (x-cx2)^2 = 0 => 2*cx2*x - cx2^2 = 0 => x = cx2/2
                            if (Math.abs(cx2) > 0.01) {
                                var xi = cx2 / 2;
                                var ysq = 1 - xi * xi;
                                if (ysq > 0.001) {
                                    var yi = Math.sqrt(ysq);
                                    viz.drawPoint(xi, yi, viz.colors.green, 'm=1', 6);
                                    viz.drawPoint(xi, -yi, viz.colors.green, 'm=1', 6);
                                    viz.screenText('Transversal: 2 points, each m=1', viz.width/2, 20, viz.colors.green, 13);
                                } else if (ysq > -0.01) {
                                    viz.drawPoint(xi, 0, viz.colors.red, 'm=2', 8);
                                    viz.screenText('Tangent: 1 point, m=2', viz.width/2, 20, viz.colors.red, 13);
                                } else {
                                    viz.screenText('No real intersections (complex points only)', viz.width/2, 20, viz.colors.text, 13);
                                }
                            }

                            viz.screenText('Drag orange handle to move second circle', viz.width/2, viz.height - 12, viz.colors.text, 11);
                            viz.drawDraggables();
                        }
                        draw();
                        viz.animate(function() { draw(); });
                        return viz;
                    }
                },
                {
                    id: 'viz-line-meets-cubic',
                    title: 'Line Meets a Cubic',
                    description: 'A line intersects a cubic curve. Bezout predicts 1 x 3 = 3 intersection points. Drag the line to see how the three intersections can merge when the line becomes tangent (multiplicity 2) or an inflectional tangent (multiplicity 3).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, scale: 50 });
                        // cubic: y = x^3 - 3x
                        var cubic = function(x) { return 0.3*(x*x*x) - 1.5*x; };
                        var slope = 0.5, intercept = 0.0;

                        var dragA = viz.addDraggable('lineA', -2, slope*(-2)+intercept, viz.colors.teal, 7, function(x, y) {
                            // Recalculate line from two draggables
                            var dx = dragB.x - x, dy = dragB.y - y;
                            if (Math.abs(dx) > 0.01) {
                                slope = dy / dx;
                                intercept = y - slope * x;
                            }
                        });
                        var dragB = viz.addDraggable('lineB', 2, slope*2+intercept, viz.colors.teal, 7, function(x, y) {
                            var dx = x - dragA.x, dy = y - dragA.y;
                            if (Math.abs(dx) > 0.01) {
                                slope = dy / dx;
                                intercept = dragA.y - slope * dragA.x;
                            }
                        });

                        function findIntersections(lo, hi) {
                            var pts = [];
                            var steps = 2000;
                            var dx = (hi - lo) / steps;
                            for (var i = 0; i < steps; i++) {
                                var x0 = lo + i * dx, x1 = lo + (i+1) * dx;
                                var d0 = cubic(x0) - (slope*x0+intercept);
                                var d1 = cubic(x1) - (slope*x1+intercept);
                                if (d0 * d1 <= 0 && isFinite(d0) && isFinite(d1)) {
                                    var a = x0, b = x1;
                                    for (var j = 0; j < 40; j++) {
                                        var m = (a+b)/2;
                                        if ((cubic(m)-(slope*m+intercept)) * (cubic(a)-(slope*a+intercept)) <= 0) b = m; else a = m;
                                    }
                                    var xr = (a+b)/2;
                                    var eps = 0.0005;
                                    var diff = function(t) { return cubic(t) - (slope*t+intercept); };
                                    var dd = (diff(xr+eps) - diff(xr-eps)) / (2*eps);
                                    var mult = 1;
                                    if (Math.abs(dd) < 0.1) {
                                        mult = 2;
                                        var dd2 = (diff(xr+eps) - 2*diff(xr) + diff(xr-eps)) / (eps*eps);
                                        if (Math.abs(dd2) < 5) mult = 3;
                                    }
                                    var dup = false;
                                    for (var k = 0; k < pts.length; k++) { if (Math.abs(pts[k].x - xr) < 0.05) { dup = true; break; } }
                                    if (!dup) pts.push({ x: xr, y: cubic(xr), mult: mult });
                                }
                            }
                            return pts;
                        }

                        function draw() {
                            viz.clear(); viz.drawGrid(); viz.drawAxes();
                            var xMin = -viz.originX / viz.scale - 1;
                            var xMax = (viz.width - viz.originX) / viz.scale + 1;

                            viz.drawFunction(cubic, xMin, xMax, viz.colors.blue, 2.5);

                            // Line
                            var lineF = function(x) { return slope * x + intercept; };
                            viz.drawFunction(lineF, xMin, xMax, viz.colors.teal, 2);

                            var pts = findIntersections(xMin, xMax);
                            var totalM = 0;
                            for (var i = 0; i < pts.length; i++) {
                                var p = pts[i];
                                totalM += p.mult;
                                var col = p.mult > 1 ? viz.colors.red : viz.colors.green;
                                viz.drawPoint(p.x, p.y, col, 'm=' + p.mult, p.mult > 1 ? 7 : 5);
                            }

                            viz.screenText('Cubic (deg 3) x Line (deg 1) => Bezout: 3', viz.width/2, 18, viz.colors.white, 13);
                            viz.screenText('Real intersections found: ' + totalM + ' (with multiplicity)', viz.width/2, viz.height - 10, viz.colors.text, 11);
                            viz.drawDraggables();
                        }
                        draw();
                        viz.animate(function() { draw(); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Compute the intersection multiplicity of \\(V(y)\\) and \\(V(y - x^3)\\) at the origin.",
                    hint: "Substitute \\(y = 0\\) into \\(y - x^3\\) and find the order of vanishing.",
                    solution: "Substituting \\(y = 0\\) into \\(G = y - x^3\\) gives \\(G(x, 0) = -x^3\\), which has order 3. So \\(I_0(y, y - x^3) = 3\\). The \\(x\\)-axis is an inflectional tangent to the cubic."
                },
                {
                    question: "Let \\(F = x^2 + y^2 - 1\\) and \\(G = x^2 + y^2 - 2x\\). Find all intersection points and their multiplicities.",
                    hint: "Subtract \\(F\\) from \\(G\\) to find a linear relation, then substitute back.",
                    solution: "\\(G - F = -2x + 1\\), so \\(x = 1/2\\). Then \\(y^2 = 1 - 1/4 = 3/4\\), giving \\(y = \\pm\\sqrt{3}/2\\). At each point, the tangent lines to the two circles are distinct (the circles cross), so each intersection has multiplicity 1. Total multiplicity: 2. Since \\(\\deg F \\cdot \\deg G = 4\\), the remaining 2 intersection points must be at infinity (the circular points \\([1 : \\pm i : 0]\\))."
                },
                {
                    question: "Show that \\(I_p(F, G) \\geq 2\\) whenever \\(F\\) and \\(G\\) are both tangent to the same line at \\(p\\).",
                    hint: "If both curves have the same tangent line \\(L\\) at \\(p\\), what happens to the leading terms of \\(F\\) and \\(G\\) after translation to the origin?",
                    solution: "Translate so \\(p\\) is the origin. The lowest-degree terms of \\(F\\) and \\(G\\) are both linear multiples of the same linear form \\(\\ell\\) (the tangent direction). So \\(F = \\alpha \\ell + \\text{(higher)}\\) and \\(G = \\beta \\ell + \\text{(higher)}\\). In the local ring, both \\(F\\) and \\(G\\) lie in \\(\\mathfrak{m}_p\\), and neither generates a unit in \\(\\mathcal{O}_p / (\\text{the other})\\). By property (1) of Theorem 6.2, since the tangent directions are the same (not distinct), \\(I_p(F,G) \\geq 2\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 3: Bezout's Theorem
        // ================================================================
        {
            id: 'sec-bezout',
            title: "Bezout's Theorem",
            content: `
<h2>Bezout's Theorem</h2>

<p>We can now state the main result. Everything we have built, projective space, algebraically closed fields, intersection multiplicity, comes together here.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.3 (Bezout's Theorem)</div>
    <div class="env-body">
        <p>Let \\(C_1 = V(F)\\) and \\(C_2 = V(G)\\) be projective plane curves of degrees \\(d_1\\) and \\(d_2\\) over an algebraically closed field \\(k\\), with no common component. Then</p>
        \\[\\sum_{p \\in C_1 \\cap C_2} I_p(C_1, C_2) = d_1 \\cdot d_2.\\]
    </div>
</div>

<p>The sum on the left counts every intersection point, real or complex, finite or at infinity, each weighted by its multiplicity. The product on the right depends only on the degrees. This is a remarkable statement: the <em>global</em> intersection count is determined by <em>local</em> data (multiplicities) and <em>global</em> data (degrees), with perfect agreement.</p>

<h3>Proof Strategy</h3>

<p>The classical proof uses the <strong>resultant</strong>, which we develop in the next section. The idea is:</p>
<ol>
    <li>Write \\(F\\) and \\(G\\) as polynomials in \\(y\\) with coefficients in \\(k[x]\\).</li>
    <li>The resultant \\(\\operatorname{Res}_y(F, G)\\) is a polynomial in \\(x\\) alone whose roots are exactly the \\(x\\)-coordinates of the intersection points.</li>
    <li>Show that \\(\\deg \\operatorname{Res}_y(F, G) = d_1 \\cdot d_2\\).</li>
    <li>Show that the multiplicity of each root of the resultant equals the sum of intersection multiplicities at that \\(x\\)-coordinate.</li>
</ol>

<h3>Special Cases</h3>

<div class="env-block example">
    <div class="env-title">Line meets degree-\\(d\\) curve</div>
    <div class="env-body">
        <p>A line (\\(d_1 = 1\\)) meets a curve of degree \\(d_2 = d\\) in exactly \\(d\\) points (counted with multiplicity). This generalizes the fundamental theorem of algebra: restricting a degree-\\(d\\) polynomial to a line gives a univariate polynomial of degree \\(d\\), which has exactly \\(d\\) roots over \\(\\mathbb{C}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Two conics</div>
    <div class="env-body">
        <p>Two conics (\\(d_1 = d_2 = 2\\)) meet in \\(2 \\times 2 = 4\\) points. This can be verified directly: solving a system of two quadratics generically gives 4 solutions.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Two cubics</div>
    <div class="env-body">
        <p>Two cubics meet in \\(3 \\times 3 = 9\\) points. This fact underlies the proof that the group law on an elliptic curve is well-defined: if a cubic passes through 8 of the 9 intersection points of two cubics, it must pass through the ninth.</p>
    </div>
</div>

<h3>What Can Go Wrong?</h3>

<p>Bezout's theorem requires that \\(C_1\\) and \\(C_2\\) share <strong>no common component</strong>. If they do, the intersection is infinite and no finite count makes sense. For instance, if \\(F = L \\cdot Q\\) and \\(G = L \\cdot R\\) where \\(L\\) is a common linear factor, then \\(V(L) \\subset C_1 \\cap C_2\\) is an entire line of intersection points.</p>

<div class="viz-placeholder" data-viz="viz-conic-conic"></div>
<div class="viz-placeholder" data-viz="viz-degenerate-bezout"></div>
`,
            visualizations: [
                {
                    id: 'viz-conic-conic',
                    title: 'Two Conics: 4 Intersection Points',
                    description: 'An ellipse and a hyperbola intersecting in 4 points, confirming Bezout: 2 x 2 = 4. The intersection points animate into view.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, scale: 55 });
                        var t = 0;

                        function drawImplicit(viz, F, xMin, xMax, yMin, yMax, color, step) {
                            var ctx = viz.ctx;
                            step = step || 0.025;
                            ctx.fillStyle = color;
                            for (var x = xMin; x <= xMax; x += step) {
                                for (var y = yMin; y <= yMax; y += step) {
                                    var v = F(x, y);
                                    if (Math.abs(v) < step * 3) {
                                        var sx = viz.originX + x * viz.scale;
                                        var sy = viz.originY - y * viz.scale;
                                        ctx.fillRect(sx - 1, sy - 1, 2, 2);
                                    }
                                }
                            }
                        }

                        // Ellipse: x^2/4 + y^2 - 1 = 0
                        var F = function(x, y) { return x*x/4 + y*y - 1; };
                        // Hyperbola: x^2 - y^2 - 0.5 = 0
                        var G = function(x, y) { return x*x - y*y - 0.5; };

                        // Intersection: x^2/4 + y^2 = 1 and x^2 - y^2 = 0.5
                        // From second: y^2 = x^2 - 0.5. Into first: x^2/4 + x^2 - 0.5 = 1 => 5x^2/4 = 1.5 => x^2 = 1.2 => x = +-sqrt(1.2)
                        var xInt = Math.sqrt(1.2);
                        var yInt = Math.sqrt(xInt*xInt - 0.5);
                        var intPts = [
                            { x: xInt, y: yInt },
                            { x: xInt, y: -yInt },
                            { x: -xInt, y: yInt },
                            { x: -xInt, y: -yInt }
                        ];

                        function draw(time) {
                            t = time * 0.001;
                            viz.clear(); viz.drawGrid(); viz.drawAxes();
                            var xMin = -viz.originX / viz.scale;
                            var xMax = (viz.width - viz.originX) / viz.scale;
                            var yMin = -(viz.height - viz.originY) / viz.scale;
                            var yMax = viz.originY / viz.scale;

                            drawImplicit(viz, F, xMin, xMax, yMin, yMax, viz.colors.blue);
                            drawImplicit(viz, G, xMin, xMax, yMin, yMax, viz.colors.orange);

                            // Animate intersection points pulsing
                            var pulse = 5 + 2 * Math.sin(t * 3);
                            for (var i = 0; i < intPts.length; i++) {
                                var p = intPts[i];
                                viz.drawPoint(p.x, p.y, viz.colors.green, 'm=1', pulse);
                            }

                            var ctx = viz.ctx;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('Ellipse (deg 2)', 12, 20);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Hyperbola (deg 2)', 12, 38);
                            ctx.fillStyle = viz.colors.white;
                            ctx.textAlign = 'center';
                            ctx.fillText('4 intersection points: 2 x 2 = 4  (Bezout)', viz.width/2, viz.height - 10);
                        }
                        viz.animate(draw);
                        return viz;
                    }
                },
                {
                    id: 'viz-degenerate-bezout',
                    title: 'When Bezout Fails: Common Components',
                    description: 'When two curves share a component (a common factor), their intersection is infinite and Bezout does not apply. Here a line is a common factor of both "curves".',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 380, scale: 50 });

                        function draw() {
                            viz.clear(); viz.drawGrid(); viz.drawAxes();
                            var xMin = -viz.originX / viz.scale - 1;
                            var xMax = (viz.width - viz.originX) / viz.scale + 1;

                            // C1 = y * (y - x + 1): a line y=0 and a line y=x-1
                            // C2 = y * (y + x - 1): a line y=0 and a line y=-x+1
                            // Common component: y = 0

                            // Draw C1 components
                            viz.drawFunction(function(x) { return 0; }, xMin, xMax, viz.colors.red, 3); // shared line y=0
                            viz.drawFunction(function(x) { return x - 1; }, xMin, xMax, viz.colors.blue, 2);

                            // Draw C2 components
                            // y=0 already drawn
                            viz.drawFunction(function(x) { return -x + 1; }, xMin, xMax, viz.colors.orange, 2);

                            // The shared line
                            var ctx = viz.ctx;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('Shared component: y = 0 (entire line)', viz.width/2, 20);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.textAlign = 'left';
                            ctx.fillText('C1 = y(y - x + 1)', 12, 50);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('C2 = y(y + x - 1)', 12, 68);
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'center';
                            ctx.fillText('Infinitely many intersections along y=0: Bezout does not apply', viz.width/2, viz.height - 12);

                            // Mark the non-shared intersection at (1, 0) where the two non-shared lines also meet
                            viz.drawPoint(1, 0, viz.colors.green, '(1,0)', 6);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "A curve of degree 5 meets a curve of degree 3. What is the maximum number of intersection points? Can you have fewer?",
                    hint: "Bezout gives an exact count with multiplicity. Think about what happens when some multiplicities exceed 1, or when some intersections are complex.",
                    solution: "By Bezout, the total multiplicity is \\(5 \\times 3 = 15\\). Since each point contributes at least multiplicity 1, you can have at most 15 distinct points. You can have fewer distinct points if some have multiplicity \\(> 1\\) (tangencies) or if some points are complex (not visible over \\(\\mathbb{R}\\)). For example, a degree-5 curve tangent to the degree-3 curve at one point contributes at least 2 from that point."
                },
                {
                    question: "Two distinct cubics in \\(\\mathbb{P}^2\\) pass through 8 given points in general position. Show they must share a ninth point.",
                    hint: "Apply Bezout to the two cubics. How many intersection points does Bezout predict?",
                    solution: "By Bezout, two cubics with no common component meet in \\(3 \\times 3 = 9\\) points (counted with multiplicity). If they already share 8 points, the ninth intersection point is forced. This is because the total intersection count is exactly 9, and all 8 given points contribute at least multiplicity 1 each, leaving exactly 1 unit of multiplicity for the ninth point."
                },
                {
                    question: "Let \\(F\\) be a smooth conic and \\(G\\) a smooth cubic in \\(\\mathbb{P}^2\\). Can all 6 intersection points have multiplicity 1?",
                    hint: "What does multiplicity 1 mean geometrically?",
                    solution: "Yes. Multiplicity 1 at every point means the conic and cubic cross transversally at each of the 6 points (distinct tangent directions). This is the generic situation: for a \"random\" conic and cubic, all intersections will be transversal. By Bezout, \\(2 \\times 3 = 6\\) and each point contributes 1, so the count works out."
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
<h2>Applications of Bezout's Theorem</h2>

<p>Bezout's theorem is the Swiss army knife of enumerative geometry. Here we explore several classical applications.</p>

<h3>Application 1: Counting Intersections</h3>

<div class="env-block example">
    <div class="env-title">Line meets a degree-\\(d\\) curve</div>
    <div class="env-body">
        <p>A line meets a degree-\\(d\\) curve in exactly \\(d\\) points (counted with multiplicity). This is the projective version of the fundamental theorem of algebra.</p>
        <p>Consequence: a projective plane curve of degree \\(d\\) cannot be contained in any line (for \\(d \\geq 2\\)), because a line would then intersect it in infinitely many points, contradicting the finite count.</p>
    </div>
</div>

<h3>Application 2: Irreducibility Criterion</h3>

<div class="env-block theorem">
    <div class="env-title">Corollary 6.4</div>
    <div class="env-body">
        <p>A projective plane curve \\(C\\) of degree \\(d\\) cannot have a singular point of multiplicity \\(> d/2\\) unless \\(C\\) is reducible (i.e., its defining polynomial factors).</p>
    </div>
</div>

<p><em>Proof.</em> If \\(p\\) is a singular point of multiplicity \\(m > d/2\\), take a general line \\(L\\) through \\(p\\). Then \\(I_p(L, C) \\geq m > d/2\\), and by Bezout, \\(\\sum_q I_q(L, C) = d\\). The remaining intersections contribute at most \\(d - m < d/2\\). But if \\(L\\) is general, it meets each irreducible component of \\(C\\) transversally at smooth points away from \\(p\\). For \\(C\\) irreducible of degree \\(d\\), the line must meet \\(C\\) in at least one other point, giving total \\(\\geq m + 1\\). If \\(m = d\\), there is no room for another intersection and \\(L \\subset C\\) (impossible for a curve). If \\(m < d\\), the argument above forces a contradiction with Bezout. \\(\\square\\)</p>

<h3>Application 3: The Group Law on Elliptic Curves</h3>

<p>An elliptic curve \\(E\\) is a smooth cubic in \\(\\mathbb{P}^2\\). Fix a point \\(O \\in E\\) (typically an inflection point). Given \\(P, Q \\in E\\), the line \\(PQ\\) meets \\(E\\) in a third point \\(R\\) (by Bezout: \\(1 \\times 3 = 3\\)). Then the line \\(OR\\) meets \\(E\\) in a third point \\(P + Q\\). This defines a group operation on \\(E\\).</p>

<p>That \\(R\\) exists and is unique (given \\(P\\) and \\(Q\\)) is a direct consequence of Bezout's theorem. The associativity of this group law is a deeper result, but the basic construction relies on Bezout at every step.</p>

<h3>Application 4: The 27 Lines on a Cubic Surface</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.5 (Cayley-Salmon, 1849)</div>
    <div class="env-body">
        <p>Every smooth cubic surface in \\(\\mathbb{P}^3\\) contains exactly 27 lines.</p>
    </div>
</div>

<p>This is one of the most celebrated results in classical algebraic geometry. While the full proof requires intersection theory on the Grassmannian (beyond our scope), the number 27 can be understood through Bezout-type reasoning:</p>

<ul>
    <li>A cubic surface \\(S \\subset \\mathbb{P}^3\\) has degree 3.</li>
    <li>A line \\(\\ell \\subset S\\) means \\(\\ell\\) is a common component of \\(S\\) and a hyperplane, so Bezout does not directly give the count.</li>
    <li>Instead, one works with the Grassmannian \\(\\mathbb{G}(1,3)\\) of lines in \\(\\mathbb{P}^3\\), which is a 4-dimensional variety. The condition "a line lies on \\(S\\)" cuts out a 0-dimensional locus, and its degree (computed via intersection theory on the Grassmannian) is 27.</li>
</ul>

<p>The 27 lines have beautiful combinatorial structure: each line meets exactly 10 others, and the configuration is governed by the Weyl group \\(W(E_6)\\) of order 51840.</p>

<div class="viz-placeholder" data-viz="viz-27-lines"></div>
`,
            visualizations: [
                {
                    id: 'viz-27-lines',
                    title: '27 Lines on a Cubic Surface',
                    description: 'A schematic view of some of the 27 lines on a cubic surface (the Clebsch diagonal surface). Rotate the 3D view by dragging. The lines are colored by their families.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 440, scale: 1, originX: 280, originY: 220 });
                        var rotX = 0.4, rotY = 0.6;
                        var drag = { active: false, lastX: 0, lastY: 0 };

                        viz.canvas.addEventListener('mousedown', function(e) {
                            drag.active = true;
                            drag.lastX = e.clientX;
                            drag.lastY = e.clientY;
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (!drag.active) return;
                            rotY += (e.clientX - drag.lastX) * 0.005;
                            rotX += (e.clientY - drag.lastY) * 0.005;
                            drag.lastX = e.clientX;
                            drag.lastY = e.clientY;
                        });
                        viz.canvas.addEventListener('mouseup', function() { drag.active = false; });
                        viz.canvas.addEventListener('mouseleave', function() { drag.active = false; });

                        // 3D projection
                        function project(x, y, z) {
                            // Rotate around Y
                            var cx = Math.cos(rotY), sy = Math.sin(rotY);
                            var x1 = cx*x + sy*z, z1 = -sy*x + cx*z;
                            // Rotate around X
                            var cy = Math.cos(rotX), sx = Math.sin(rotX);
                            var y1 = cy*y - sx*z1, z2 = sx*y + cy*z1;
                            // Perspective
                            var scale = 120 / (3 + z2 * 0.3);
                            return [viz.originX + x1 * scale, viz.originY - y1 * scale, z2];
                        }

                        // Generate some representative lines on a cubic surface
                        // We'll use a stylized version: 27 lines arranged in 3 families of 6 + 6 + 15
                        // Simplified: show 15 lines in a suggestive arrangement on a wireframe
                        var lines = [];
                        var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink];

                        // Family 1: 6 lines roughly along one ruling
                        for (var i = 0; i < 6; i++) {
                            var th = i * Math.PI / 3;
                            var r = 1.2;
                            lines.push({
                                p1: [r*Math.cos(th), r*Math.sin(th), -1.2],
                                p2: [r*Math.cos(th + 0.5), r*Math.sin(th + 0.5), 1.2],
                                color: colors[0]
                            });
                        }
                        // Family 2: 6 lines in another ruling
                        for (var i = 0; i < 6; i++) {
                            var th = i * Math.PI / 3 + Math.PI / 6;
                            var r = 1.2;
                            lines.push({
                                p1: [r*Math.cos(th), -1.2, r*Math.sin(th)],
                                p2: [r*Math.cos(th + 0.4), 1.2, r*Math.sin(th + 0.4)],
                                color: colors[1]
                            });
                        }
                        // Family 3: 15 "exceptional" lines (show a subset)
                        for (var i = 0; i < 9; i++) {
                            var phi = i * 2 * Math.PI / 9;
                            var r1 = 1.0, r2 = 1.0;
                            lines.push({
                                p1: [r1*Math.cos(phi), r1*Math.sin(phi), -0.8 + 0.3*Math.sin(phi*2)],
                                p2: [-r2*Math.cos(phi+1.2), -r2*Math.sin(phi+1.2), 0.8 - 0.3*Math.cos(phi*2)],
                                color: colors[2 + (i % 4)]
                            });
                        }
                        // Additional lines to approach 27
                        for (var i = 0; i < 6; i++) {
                            var phi = i * Math.PI / 3 + 0.2;
                            lines.push({
                                p1: [-1.1, Math.cos(phi), Math.sin(phi)],
                                p2: [1.1, Math.cos(phi+0.8), Math.sin(phi+0.8)],
                                color: colors[4 + (i % 2)]
                            });
                        }

                        function draw(time) {
                            if (!drag.active) {
                                rotY += 0.003;
                            }
                            viz.clear();
                            var ctx = viz.ctx;

                            // Sort lines by average depth for painter's algorithm
                            var sortedLines = lines.map(function(l) {
                                var p1 = project(l.p1[0], l.p1[1], l.p1[2]);
                                var p2 = project(l.p2[0], l.p2[1], l.p2[2]);
                                return { sx1: p1[0], sy1: p1[1], sx2: p2[0], sy2: p2[1], z: (p1[2]+p2[2])/2, color: l.color };
                            });
                            sortedLines.sort(function(a, b) { return a.z - b.z; });

                            for (var i = 0; i < sortedLines.length; i++) {
                                var l = sortedLines[i];
                                var alpha = Math.max(0.3, Math.min(1, 0.6 + l.z * 0.2));
                                ctx.strokeStyle = l.color;
                                ctx.globalAlpha = alpha;
                                ctx.lineWidth = 1.8;
                                ctx.beginPath();
                                ctx.moveTo(l.sx1, l.sy1);
                                ctx.lineTo(l.sx2, l.sy2);
                                ctx.stroke();
                            }
                            ctx.globalAlpha = 1;

                            viz.screenText('27 Lines on a Cubic Surface (schematic)', viz.width/2, 18, viz.colors.white, 14);
                            viz.screenText('Drag to rotate  |  ' + lines.length + ' lines shown', viz.width/2, viz.height - 12, viz.colors.text, 11);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = colors[0]; ctx.fillText('Family E_i', 12, viz.height - 60);
                            ctx.fillStyle = colors[1]; ctx.fillText('Family F_ij', 12, viz.height - 44);
                            ctx.fillStyle = colors[2]; ctx.fillText('Family G_ij', 12, viz.height - 28);
                        }
                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "A smooth conic in \\(\\mathbb{P}^2\\) and a smooth quartic (degree 4) curve intersect. What is the total number of intersection points, counted with multiplicity?",
                    hint: "Direct application of Bezout.",
                    solution: "By Bezout, the total is \\(2 \\times 4 = 8\\) points, counted with multiplicity."
                },
                {
                    question: "Let \\(E\\) be a smooth cubic (elliptic curve) in \\(\\mathbb{P}^2\\), and let \\(L\\) be a line that is tangent to \\(E\\) at a point \\(P\\). Show that \\(L\\) meets \\(E\\) in exactly one other point (counted with multiplicity), and determine the multiplicity at \\(P\\).",
                    hint: "Bezout says \\(1 \\times 3 = 3\\). Tangency means \\(I_P(L, E) \\geq 2\\).",
                    solution: "By Bezout, \\(\\sum_Q I_Q(L, E) = 3\\). Since \\(L\\) is tangent at \\(P\\), we have \\(I_P(L, E) \\geq 2\\). The remaining multiplicity is \\(3 - I_P(L, E)\\). If \\(P\\) is not an inflection point, \\(I_P = 2\\) and there is exactly one other point \\(Q\\) with \\(I_Q = 1\\). If \\(P\\) is an inflection point, \\(I_P = 3\\) and \\(L\\) meets \\(E\\) only at \\(P\\) (the inflectional tangent)."
                }
            ]
        },

        // ================================================================
        // SECTION 5: Resultants
        // ================================================================
        {
            id: 'sec-resultant',
            title: 'Resultants',
            content: `
<h2>Resultants: The Computational Engine</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Idea</div>
    <div class="env-body">
        <p>How do you eliminate a variable from two polynomial equations? The resultant does exactly this. Given \\(F(x,y) = 0\\) and \\(G(x,y) = 0\\), the resultant \\(\\operatorname{Res}_y(F, G)\\) is a polynomial in \\(x\\) alone that is zero precisely when \\(F\\) and \\(G\\) have a common solution for that value of \\(x\\).</p>
    </div>
</div>

<h3>Definition via the Sylvester Matrix</h3>

<p>Write \\(F\\) and \\(G\\) as polynomials in \\(y\\):</p>
\\[F = a_m y^m + a_{m-1} y^{m-1} + \\cdots + a_0, \\qquad G = b_n y^n + b_{n-1} y^{n-1} + \\cdots + b_0\\]
<p>where \\(a_i, b_j \\in k[x]\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition 6.6 (Resultant)</div>
    <div class="env-body">
        <p>The <strong>resultant</strong> \\(\\operatorname{Res}_y(F, G)\\) is the determinant of the <strong>Sylvester matrix</strong>, the \\((m+n) \\times (m+n)\\) matrix</p>
        \\[\\operatorname{Syl}(F,G) = \\begin{pmatrix} a_m & a_{m-1} & \\cdots & a_0 & & \\\\ & a_m & a_{m-1} & \\cdots & a_0 & \\\\ & & \\ddots & & & \\ddots \\\\ b_n & b_{n-1} & \\cdots & b_0 & & \\\\ & b_n & b_{n-1} & \\cdots & b_0 & \\\\ & & \\ddots & & & \\ddots \\end{pmatrix}\\]
        <p>where the first \\(n\\) rows are shifted copies of the coefficients of \\(F\\), and the last \\(m\\) rows are shifted copies of the coefficients of \\(G\\).</p>
    </div>
</div>

<h3>Key Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.7 (Properties of the Resultant)</div>
    <div class="env-body">
        <ol>
            <li>\\(\\operatorname{Res}_y(F, G) = 0\\) if and only if \\(F\\) and \\(G\\) have a common root in \\(y\\) (over the algebraic closure) or \\(a_m = b_n = 0\\).</li>
            <li>If \\(a_m\\) is a nonzero constant, then \\(\\operatorname{Res}_y(F, G) = a_m^n \\prod_{i=1}^{m} G(x, \\alpha_i)\\) where \\(\\alpha_1, \\ldots, \\alpha_m\\) are the roots of \\(F\\) in \\(y\\).</li>
            <li>\\(\\deg_x \\operatorname{Res}_y(F, G) \\leq (\\deg F)(\\deg G)\\), with equality for generic \\(F, G\\).</li>
        </ol>
    </div>
</div>

<p>Property (2) shows why the resultant works: it evaluates \\(G\\) at every root of \\(F\\) and multiplies the results. The product is zero exactly when some root of \\(F\\) is also a root of \\(G\\), i.e., when the curves intersect.</p>

<h3>Example: Line and Conic</h3>

<div class="env-block example">
    <div class="env-title">Resultant of \\(y - x\\) and \\(x^2 + y^2 - 1\\)</div>
    <div class="env-body">
        <p>Take \\(F = y - x\\) (degree 1 in \\(y\\)) and \\(G = x^2 + y^2 - 1\\) (degree 2 in \\(y\\)). The Sylvester matrix is \\(3 \\times 3\\):</p>
        \\[\\operatorname{Syl} = \\begin{pmatrix} 1 & -x & 0 \\\\ 1 & 0 & x^2 - 1 \\\\ 0 & 1 & 0 \\end{pmatrix}\\]
        <p>Wait, let us be more careful. Writing \\(F = 1 \\cdot y + (-x)\\) and \\(G = 1 \\cdot y^2 + 0 \\cdot y + (x^2 - 1)\\):</p>
        \\[\\operatorname{Syl} = \\begin{pmatrix} 1 & -x & 0 \\\\ 0 & 1 & -x \\\\ 1 & 0 & x^2 - 1 \\end{pmatrix}\\]
        \\[\\operatorname{Res}_y(F, G) = \\det \\begin{pmatrix} 1 & -x & 0 \\\\ 0 & 1 & -x \\\\ 1 & 0 & x^2-1 \\end{pmatrix} = 1(x^2-1) - (-x)(0-(-x)) + 0 = x^2 - 1 - x^2 = 2x^2 - 1\\]
        <p>Setting \\(2x^2 - 1 = 0\\) gives \\(x = \\pm 1/\\sqrt{2}\\), the \\(x\\)-coordinates of the two intersection points.</p>
    </div>
</div>

<h3>Resultants and Bezout's Theorem</h3>

<p>The resultant provides a direct proof of Bezout's theorem. If \\(F\\) has degree \\(d_1\\) and \\(G\\) has degree \\(d_2\\), then (in the projective setting, with generic coordinates) \\(\\deg \\operatorname{Res}_y(F, G) = d_1 d_2\\). Each root of the resultant corresponds to an intersection point (or multiple intersection points at the same \\(x\\)-coordinate), and the multiplicity of the root matches the sum of intersection multiplicities. Since a degree-\\(d_1 d_2\\) polynomial has exactly \\(d_1 d_2\\) roots (with multiplicity, over \\(\\mathbb{C}\\)), Bezout follows.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: "Compute \\(\\operatorname{Res}_y(y - x^2,\\, y^2 - x)\\).",
                    hint: "Substitute \\(y = x^2\\) into \\(y^2 - x\\) using property (2) of the resultant.",
                    solution: "By property (2), \\(\\operatorname{Res}_y(y - x^2, y^2 - x) = (x^2)^2 - x = x^4 - x = x(x^3 - 1)\\). The roots are \\(x = 0\\) and \\(x^3 = 1\\), i.e., \\(x = 0, 1, \\omega, \\omega^2\\) where \\(\\omega = e^{2\\pi i/3}\\). This gives 4 intersection points (all with multiplicity 1), confirming Bezout: \\(\\deg(y-x^2) \\cdot \\deg(y^2-x) = 2 \\times 2 = 4\\)."
                },
                {
                    question: "Let \\(F = y^2 - x^3\\) (a cuspidal cubic) and \\(G = y - x\\). Compute \\(\\operatorname{Res}_y(F, G)\\) and identify the intersection points with multiplicities.",
                    hint: "Substitute \\(y = x\\) into \\(F\\).",
                    solution: "\\(\\operatorname{Res}_y(F, G)\\): substitute \\(y = x\\) into \\(y^2 - x^3\\): we get \\(x^2 - x^3 = x^2(1 - x)\\). The roots are \\(x = 0\\) (multiplicity 2) and \\(x = 1\\) (multiplicity 1). At \\(x = 0\\): the point is the cusp \\((0,0)\\), where the line is tangent to the cubic. At \\(x = 1\\): the point is \\((1,1)\\), a transversal crossing. Total multiplicity: \\(2 + 1 = 3 = 1 \\times 3 = \\deg G \\cdot \\deg F\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From Intersections to Local Theory</h2>

<p>Bezout's theorem is both an endpoint and a starting point. As an endpoint, it completes our study of <em>global</em> projective geometry: we can now count intersection points between any two curves. As a starting point, it raises questions that will drive the next part of the course.</p>

<h3>What We Have Built</h3>

<p>Over Chapters 4-6, we developed the projective framework:</p>
<ul>
    <li><strong>Chapter 4</strong>: Projective space \\(\\mathbb{P}^n\\), homogeneous coordinates, projective varieties.</li>
    <li><strong>Chapter 5</strong>: Projective curves, their degree, rational maps, and the genus.</li>
    <li><strong>Chapter 6</strong>: Intersection multiplicity and Bezout's theorem.</li>
</ul>

<p>The key lesson: working in \\(\\mathbb{P}^n\\) over \\(\\mathbb{C}\\) with multiplicities gives clean, exact answers to enumerative questions.</p>

<h3>What Comes Next: Local Theory</h3>

<p>Bezout tells us <em>how many</em> intersection points there are. But it says little about the <em>local geometry</em> at each point. In Part C, we turn to local questions:</p>

<ul>
    <li><strong>Chapter 7: Local Rings and Tangent Spaces.</strong> The local ring \\(\\mathcal{O}_{X,p}\\) that appeared in our definition of intersection multiplicity is itself a fundamental invariant. It encodes the "infinitesimal neighborhood" of \\(p\\) on \\(X\\). The tangent space (its associated graded) tells us the first-order geometry.</li>
    <li><strong>Chapter 8: Singularities and Blowups.</strong> Points where the tangent space has "too large" dimension are singularities. Blowing up replaces a singular point with a projective space, potentially resolving the singularity. This is the beginning of birational geometry.</li>
    <li><strong>Chapter 9: Smooth Curves and the Genus.</strong> For smooth projective curves, the genus is a complete topological invariant. It connects to Bezout via the genus-degree formula: a smooth plane curve of degree \\(d\\) has genus \\(g = \\frac{(d-1)(d-2)}{2}\\).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Genus-Degree Formula</div>
    <div class="env-body">
        <p>As a preview, the genus-degree formula \\(g = \\frac{(d-1)(d-2)}{2}\\) can be proven using Bezout's theorem. The idea: intersect a degree-\\(d\\) curve with a <em>pencil</em> of lines. Each line meets the curve in \\(d\\) points (by Bezout). As the line moves, the \\(d\\) points trace out branches. The genus counts how many "handles" the resulting Riemann surface has. The Riemann-Hurwitz formula (Chapter 16) makes this precise.</p>
    </div>
</div>

<h3>Bezout in Higher Dimensions</h3>

<p>Everything we have done generalizes. In \\(\\mathbb{P}^n\\), if \\(n\\) hypersurfaces of degrees \\(d_1, \\ldots, d_n\\) meet transversally, the number of intersection points is \\(d_1 \\cdot d_2 \\cdots d_n\\). The general intersection theory of algebraic geometry (Chow rings, Schubert calculus) provides the framework for counting intersections of subvarieties of arbitrary dimension and codimension. This leads eventually to the deep connections between algebraic geometry and topology that characterize modern mathematics.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: "Use the genus-degree formula to compute the genus of a smooth quartic curve in \\(\\mathbb{P}^2\\).",
                    hint: "Plug \\(d = 4\\) into \\(g = (d-1)(d-2)/2\\).",
                    solution: "\\(g = \\frac{(4-1)(4-2)}{2} = \\frac{3 \\times 2}{2} = 3\\). A smooth quartic is a genus-3 curve. As a Riemann surface, it is a 3-holed torus."
                },
                {
                    question: "Three quadric surfaces in \\(\\mathbb{P}^3\\) meet transversally. How many intersection points are there?",
                    hint: "Generalize Bezout to 3 hypersurfaces in \\(\\mathbb{P}^3\\).",
                    solution: "By the higher-dimensional Bezout theorem, the number of intersection points is \\(2 \\times 2 \\times 2 = 8\\)."
                }
            ]
        }
    ]
});
