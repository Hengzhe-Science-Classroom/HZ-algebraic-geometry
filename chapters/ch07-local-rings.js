window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: 'Local Rings & Tangent Spaces',
    subtitle: 'Zooming in: the local algebra of a point',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Go Local?</h2>

<div class="env-block intuition">
    <div class="env-title">The View from a Point</div>
    <div class="env-body">
        <p>In calculus, you understand a curve by zooming in at a point: the tangent line captures the first-order behavior, the curvature refines it. In algebraic geometry, we do the same thing, but algebraically. The tool that lets us "zoom in" on a variety at a point is <strong>localization</strong>, and the algebraic object we land on is the <strong>local ring</strong>.</p>
    </div>
</div>

<p>So far we have studied varieties and their coordinate rings as global objects. The ring \\(k[V]\\) encodes polynomial functions defined <em>everywhere</em> on \\(V\\). But many geometric questions are local: Is \\(V\\) smooth at \\(p\\)? What does \\(V\\) look like near \\(p\\)?</p>

<p>Consider the curve \\(V(y^2 - x^3)\\) in \\(\\mathbb{A}^2\\). Away from the origin, it looks like a smooth curve. At the origin, something goes wrong: there is a cusp. The global coordinate ring \\(k[x,y]/(y^2 - x^3)\\) does not immediately reveal this local pathology. To detect it, we need to focus on what happens <em>near</em> the origin.</p>

<h3>What This Chapter Builds</h3>

<p>We develop three interrelated ideas:</p>
<ol>
    <li><strong>Localization</strong> (algebra): the construction that lets us invert functions nonvanishing at \\(p\\), producing the local ring \\(\\mathcal{O}_{V,p}\\).</li>
    <li><strong>The Zariski tangent space</strong> (linear algebra): the vector space \\((\\mathfrak{m}_p / \\mathfrak{m}_p^2)^*\\) that plays the role of the tangent space.</li>
    <li><strong>Smoothness</strong> (geometry): the condition \\(\\dim T_p V = \\dim V\\) that separates smooth points from singular ones.</li>
</ol>

<p>The interplay between algebra (local rings, maximal ideals) and geometry (tangent lines, smooth points) is the central theme of this chapter, and one of the most beautiful features of algebraic geometry.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The local study of algebraic varieties has roots in the work of Zariski (1940s), who introduced the "Zariski tangent space" and showed that local properties of varieties are captured by their local rings. This was a crucial step toward the modern theory of schemes, where every point carries its own local ring.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-localization-diagram',
                    title: 'Localization: Zooming In',
                    description: 'Functions on the whole variety vs. functions near a point. Drag the point \\(p\\) along the curve. The "local view" shows functions that are well-defined near \\(p\\), even if they have poles elsewhere.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 55
                        });

                        // Curve: y^2 = x^3 - x (elliptic-ish, smooth)
                        var pt = viz.addDraggable('p', 1.2, 0.5, viz.colors.teal, 8);
                        var zoomRadius = 1.5;

                        VizEngine.createSlider(controls, 'Zoom radius', 0.5, 3, zoomRadius, 0.1, function(v) {
                            zoomRadius = v;
                        });

                        function curveY(x) {
                            var val = x * x * x - x;
                            return val >= 0 ? Math.sqrt(val) : NaN;
                        }

                        function snapToUpper(x) {
                            var y = curveY(x);
                            return isFinite(y) ? y : 0;
                        }

                        viz.animate(function() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            // Draw curve y^2 = x^3 - x (both branches)
                            viz.drawFunction(function(x) { return curveY(x); }, -2, 6, viz.colors.blue, 2, 400);
                            viz.drawFunction(function(x) { return -curveY(x); }, -2, 6, viz.colors.blue, 2, 400);
                            // Left component
                            viz.drawFunction(function(x) {
                                var val = x*x*x - x;
                                return val >= 0 ? Math.sqrt(val) : NaN;
                            }, -6, -0.001, viz.colors.blue, 2, 200);
                            viz.drawFunction(function(x) {
                                var val = x*x*x - x;
                                return val >= 0 ? -Math.sqrt(val) : NaN;
                            }, -6, -0.001, viz.colors.blue, 2, 200);

                            // Snap draggable to upper branch
                            if (pt.x < 1.001) pt.x = 1.001;
                            pt.y = snapToUpper(pt.x);

                            // Draw zoom circle
                            var [sx, sy] = viz.toScreen(pt.x, pt.y);
                            var sr = zoomRadius * viz.scale;
                            ctx.strokeStyle = viz.colors.teal + '66';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Fill zoom region
                            ctx.fillStyle = viz.colors.teal + '15';
                            ctx.beginPath();
                            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                            ctx.fill();

                            // Highlight the curve segment inside the zoom
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 300; i++) {
                                var t = pt.x - zoomRadius + 2 * zoomRadius * i / 300;
                                var yy = curveY(t);
                                if (!isFinite(yy)) { started = false; continue; }
                                var dx = t - pt.x, dy = yy - pt.y;
                                if (dx * dx + dy * dy > zoomRadius * zoomRadius) { started = false; continue; }
                                var sp = viz.toScreen(t, yy);
                                if (!started) { ctx.moveTo(sp[0], sp[1]); started = true; }
                                else ctx.lineTo(sp[0], sp[1]);
                            }
                            ctx.stroke();

                            // Draw point
                            viz.drawPoint(pt.x, pt.y, viz.colors.teal, 'p', 6);

                            // Labels
                            viz.screenText('V(y\u00B2 = x\u00B3 \u2212 x)', viz.width - 80, 30, viz.colors.blue, 12);
                            viz.screenText('Global: k[V] = k[x,y]/(y\u00B2\u2212x\u00B3+x)', viz.width / 2, viz.height - 50, viz.colors.text, 11);
                            viz.screenText('Local: \ud835\udcaa_{V,p} \u2014 functions defined near p', viz.width / 2, viz.height - 30, viz.colors.orange, 11);
                            viz.screenText('(orange = local neighborhood)', viz.width / 2, viz.height - 12, viz.colors.teal, 10);
                        });
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Localization & Local Rings
        // ================================================================
        {
            id: 'sec-localization',
            title: 'Localization & Local Rings',
            content: `
<h2>Localization & Local Rings</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Idea</div>
    <div class="env-body">
        <p>Think of rational functions like \\(\\frac{x}{y-1}\\). This is not a well-defined function on all of \\(\\mathbb{A}^2\\), because the denominator vanishes when \\(y = 1\\). But near a point \\(p = (0, 0)\\), the denominator \\(y - 1 = -1 \\neq 0\\), so the function is perfectly well-defined locally. <strong>Localization</strong> is the algebraic operation that makes all such "locally defined" functions available.</p>
    </div>
</div>

<h3>Localization of a Ring</h3>

<div class="env-block definition">
    <div class="env-title">Definition 7.1 (Localization)</div>
    <div class="env-body">
        <p>Let \\(A\\) be a commutative ring and \\(S \\subseteq A\\) a multiplicative subset (i.e., \\(1 \\in S\\) and \\(S\\) is closed under multiplication). The <strong>localization</strong> \\(S^{-1}A\\) is the ring of fractions \\(\\frac{a}{s}\\) with \\(a \\in A\\), \\(s \\in S\\), subject to the equivalence relation</p>
        \\[\\frac{a}{s} = \\frac{a'}{s'} \\iff \\exists\\, t \\in S \\text{ such that } t(as' - a's) = 0.\\]
        <p>Addition and multiplication are defined as for ordinary fractions.</p>
    </div>
</div>

<p>The most important case for geometry is when \\(S\\) consists of all functions that do not vanish at a particular point.</p>

<h3>The Local Ring at a Point</h3>

<div class="env-block definition">
    <div class="env-title">Definition 7.2 (Local Ring \\(\\mathcal{O}_{V,p}\\))</div>
    <div class="env-body">
        <p>Let \\(V\\) be an affine variety with coordinate ring \\(k[V]\\), and let \\(p \\in V\\). The <strong>maximal ideal</strong> at \\(p\\) is</p>
        \\[\\mathfrak{m}_p = \\{f \\in k[V] : f(p) = 0\\}.\\]
        <p>The <strong>local ring of \\(V\\) at \\(p\\)</strong> is the localization</p>
        \\[\\mathcal{O}_{V,p} = (k[V] \\setminus \\mathfrak{m}_p)^{-1} k[V] = \\left\\{\\frac{f}{g} : f, g \\in k[V],\\; g(p) \\neq 0\\right\\}.\\]
        <p>This is a <strong>local ring</strong>: it has a unique maximal ideal \\(\\mathfrak{m}_p \\cdot \\mathcal{O}_{V,p}\\), consisting of fractions \\(f/g\\) with \\(f(p) = 0\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\mathcal{O}_{\\mathbb{A}^1, 0}\\)</div>
    <div class="env-body">
        <p>For \\(V = \\mathbb{A}^1\\) with coordinate ring \\(k[x]\\), the local ring at the origin is</p>
        \\[\\mathcal{O}_{\\mathbb{A}^1, 0} = \\left\\{\\frac{f(x)}{g(x)} : f, g \\in k[x],\\; g(0) \\neq 0\\right\\}.\\]
        <p>The maximal ideal is \\(\\mathfrak{m}_0 = (x)\\), the fractions with \\(f(0) = 0\\). Elements like \\(\\frac{x^2}{1 + x}\\) belong to \\(\\mathfrak{m}_0\\), while \\(\\frac{1}{1 - x}\\) is a unit (invertible).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 7.3 (Local Rings Detect Local Geometry)</div>
    <div class="env-body">
        <p>Two varieties \\(V\\) and \\(W\\) are locally isomorphic at points \\(p\\) and \\(q\\) (i.e., isomorphic on some Zariski-open neighborhoods) if and only if \\(\\mathcal{O}_{V,p} \\cong \\mathcal{O}_{W,q}\\) as \\(k\\)-algebras.</p>
    </div>
</div>

<p>This proposition says the local ring is exactly the right algebraic invariant to capture "what the variety looks like near a point."</p>

<h3>Properties of Local Rings</h3>

<div class="env-block theorem">
    <div class="env-title">Proposition 7.4</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{O} = \\mathcal{O}_{V,p}\\) with maximal ideal \\(\\mathfrak{m}\\). Then:</p>
        <ol>
            <li>\\(\\mathcal{O}\\) is a local ring: it has a unique maximal ideal \\(\\mathfrak{m}\\).</li>
            <li>The residue field \\(\\mathcal{O}/\\mathfrak{m} \\cong k\\) (via the evaluation map \\(f/g \\mapsto f(p)/g(p)\\)).</li>
            <li>\\(\\dim_{\\text{Krull}} \\mathcal{O} = \\dim V\\) (the dimension of the variety at \\(p\\)).</li>
        </ol>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Let \\(V = V(xy) \\subset \\mathbb{A}^2\\) (the union of the two coordinate axes). Describe the local ring \\(\\mathcal{O}_{V,(0,0)}\\) and its maximal ideal. Is this ring an integral domain?',
                    hint: 'The coordinate ring is \\(k[x,y]/(xy)\\). Localize at \\(\\mathfrak{m} = (x,y)\\). Think about whether \\(xy = 0\\) with \\(x \\neq 0\\) and \\(y \\neq 0\\) is possible.',
                    solution: 'The coordinate ring is \\(k[x,y]/(xy)\\). The local ring \\(\\mathcal{O}_{V,(0,0)}\\) is the localization of \\(k[x,y]/(xy)\\) at \\(\\mathfrak{m} = (\\bar{x}, \\bar{y})\\). Since \\(\\bar{x} \\cdot \\bar{y} = 0\\) but neither \\(\\bar{x}\\) nor \\(\\bar{y}\\) is zero, this local ring is <em>not</em> an integral domain. This reflects the geometry: at the origin, \\(V\\) is the union of two lines, which is reducible.'
                },
                {
                    question: 'Show that \\(\\mathcal{O}_{\\mathbb{A}^1, 0} \\cong k[x]_{(x)}\\) is a principal ideal domain. What is \\(\\mathcal{O}_{\\mathbb{A}^1, 0}/(x^n)\\)?',
                    hint: 'Every nonzero element of \\(k[x]_{(x)}\\) can be written as \\(x^k \\cdot u\\) where \\(u\\) is a unit. What are the ideals?',
                    solution: 'Every nonzero element of \\(k[x]_{(x)}\\) has the form \\(x^k u\\) with \\(u\\) a unit (since the denominator is nonvanishing at 0, and after factoring out the zero at the origin, what remains is a unit). The ideals are exactly \\((x^n)\\) for \\(n \\geq 0\\), so this is a PID (in fact a DVR). The quotient \\(\\mathcal{O}/(x^n) \\cong k[x]/(x^n)\\), the ring of "\\(n\\)-th order Taylor expansions at 0."'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Zariski Tangent Space
        // ================================================================
        {
            id: 'sec-tangent',
            title: 'The Zariski Tangent Space',
            content: `
<h2>The Zariski Tangent Space</h2>

<div class="env-block intuition">
    <div class="env-title">Two Ways to Think About Tangent Vectors</div>
    <div class="env-body">
        <p>In differential geometry, a tangent vector at \\(p\\) can be defined as either:</p>
        <ol>
            <li>A <strong>derivation</strong>: a linear map \\(D: C^\\infty(M) \\to \\mathbb{R}\\) satisfying the Leibniz rule \\(D(fg) = f(p)D(g) + g(p)D(f)\\).</li>
            <li>An element of \\((\\mathfrak{m}_p / \\mathfrak{m}_p^2)^*\\), where \\(\\mathfrak{m}_p\\) is the ideal of functions vanishing at \\(p\\).</li>
        </ol>
        <p>In algebraic geometry, approach (2) works perfectly and gives us a purely algebraic definition of the tangent space.</p>
    </div>
</div>

<h3>The Cotangent Space and Tangent Space</h3>

<div class="env-block definition">
    <div class="env-title">Definition 7.5 (Zariski Cotangent and Tangent Spaces)</div>
    <div class="env-body">
        <p>Let \\(V\\) be a variety, \\(p \\in V\\), and \\(\\mathfrak{m}_p\\) the maximal ideal of \\(\\mathcal{O}_{V,p}\\). The <strong>Zariski cotangent space</strong> at \\(p\\) is the \\(k\\)-vector space</p>
        \\[\\mathfrak{m}_p / \\mathfrak{m}_p^2.\\]
        <p>The <strong>Zariski tangent space</strong> at \\(p\\) is its dual:</p>
        \\[T_p V = (\\mathfrak{m}_p / \\mathfrak{m}_p^2)^*.\\]
    </div>
</div>

<p>Why \\(\\mathfrak{m}_p / \\mathfrak{m}_p^2\\)? The ideal \\(\\mathfrak{m}_p\\) consists of functions vanishing at \\(p\\). The quotient \\(\\mathfrak{m}_p / \\mathfrak{m}_p^2\\) kills the "second order and higher" information, retaining only the <em>linear</em> part. This is exactly what a tangent vector should see.</p>

<h3>Concrete Computation</h3>

<div class="env-block theorem">
    <div class="env-title">Proposition 7.6</div>
    <div class="env-body">
        <p>Let \\(V = V(f_1, \\ldots, f_r) \\subset \\mathbb{A}^n\\) and \\(p \\in V\\). The Zariski tangent space \\(T_p V\\) is the kernel of the Jacobian:</p>
        \\[T_p V = \\left\\{ v \\in k^n : J(p) \\cdot v = 0 \\right\\}\\]
        <p>where \\(J(p)\\) is the \\(r \\times n\\) matrix \\(\\left(\\frac{\\partial f_i}{\\partial x_j}(p)\\right)\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Sketch of Proof</div>
    <div class="env-body">
        <p>The maximal ideal of \\(p = (a_1, \\ldots, a_n)\\) in \\(k[\\mathbb{A}^n]\\) is \\(\\mathfrak{m}_p = (x_1 - a_1, \\ldots, x_n - a_n)\\). Modulo \\(\\mathfrak{m}_p^2\\), any polynomial \\(f\\) with \\(f(p) = 0\\) reduces to its linear part:</p>
        \\[f \\equiv \\sum_j \\frac{\\partial f}{\\partial x_j}(p)(x_j - a_j) \\pmod{\\mathfrak{m}_p^2}.\\]
        <p>For \\(V = V(f_1, \\ldots, f_r)\\), the cotangent space \\(\\mathfrak{m}_p / \\mathfrak{m}_p^2\\) of \\(V\\) at \\(p\\) is the quotient of \\(\\text{span}(x_1 - a_1, \\ldots, x_n - a_n)\\) by the linear parts of \\(f_1, \\ldots, f_r\\). Dualizing gives the kernel of the Jacobian.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Tangent to a Parabola</div>
    <div class="env-body">
        <p>Let \\(V = V(y - x^2) \\subset \\mathbb{A}^2\\). At \\(p = (1, 1)\\):</p>
        \\[J(p) = \\begin{pmatrix} \\frac{\\partial}{\\partial x}(y - x^2) & \\frac{\\partial}{\\partial y}(y - x^2) \\end{pmatrix}\\bigg|_{(1,1)} = \\begin{pmatrix} -2 & 1 \\end{pmatrix}.\\]
        <p>So \\(T_p V = \\ker(-2, 1) = \\{(v_1, v_2) : -2v_1 + v_2 = 0\\} = \\text{span}(1, 2)\\), which is the tangent line with slope 2, as expected from calculus: \\(dy/dx = 2x|_{x=1} = 2\\).</p>
    </div>
</div>

<h3>Derivations</h3>

<div class="env-block definition">
    <div class="env-title">Definition 7.7 (Derivation at a Point)</div>
    <div class="env-body">
        <p>A <strong>derivation</strong> at \\(p\\) on \\(\\mathcal{O}_{V,p}\\) is a \\(k\\)-linear map \\(D: \\mathcal{O}_{V,p} \\to k\\) satisfying the Leibniz rule:</p>
        \\[D(fg) = f(p)D(g) + g(p)D(f).\\]
        <p>The space of all derivations at \\(p\\), denoted \\(\\text{Der}_p(\\mathcal{O}_{V,p}, k)\\), is canonically isomorphic to \\(T_p V\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-tangent-line"></div>
`,
            visualizations: [
                {
                    id: 'viz-tangent-line',
                    title: 'Tangent Line from the Jacobian',
                    description: 'Drag the point \\(p\\) along the curve \\(y = x^2\\). The tangent line is computed from the Jacobian \\(J(p) = (-2x_0,\\, 1)\\). The tangent space \\(T_p V\\) is the kernel of \\(J(p)\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 300, scale: 60
                        });

                        var pt = viz.addDraggable('p', 1, 1, viz.colors.teal, 8);

                        viz.animate(function() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();

                            // Draw parabola y = x^2
                            viz.drawFunction(function(x) { return x * x; }, -5, 5, viz.colors.blue, 2);

                            // Snap point to curve
                            pt.y = pt.x * pt.x;

                            // Tangent line: slope = 2x at p
                            var slope = 2 * pt.x;
                            // y - pt.y = slope * (x - pt.x)  =>  y = slope*x - slope*pt.x + pt.y
                            viz.drawFunction(function(x) {
                                return slope * (x - pt.x) + pt.y;
                            }, pt.x - 4, pt.x + 4, viz.colors.orange, 2);

                            viz.drawPoint(pt.x, pt.y, viz.colors.teal, 'p = (' + pt.x.toFixed(1) + ', ' + pt.y.toFixed(1) + ')', 6);

                            // Info
                            viz.screenText('V(y \u2212 x\u00B2)', 80, 25, viz.colors.blue, 13);
                            viz.screenText('J(p) = (\u22122x\u2080, 1) = (' + (-2*pt.x).toFixed(1) + ', 1)', viz.width / 2, viz.height - 40, viz.colors.text, 12);
                            viz.screenText('T_pV = span(1, ' + slope.toFixed(1) + ')  [slope = ' + slope.toFixed(1) + ']', viz.width / 2, viz.height - 20, viz.colors.orange, 12);
                        });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Zariski tangent space \\(T_p V\\) for \\(V = V(x^2 + y^2 - 1) \\subset \\mathbb{A}^2\\) at \\(p = (1, 0)\\) and at \\(p = (0, 1)\\).',
                    hint: 'The Jacobian is \\((2x, 2y)\\). Evaluate at each point and find the kernel.',
                    solution: 'At \\(p = (1,0)\\): \\(J = (2, 0)\\), so \\(T_pV = \\ker(2, 0) = \\{(0, t) : t \\in k\\} = \\text{span}(0,1)\\). This is the vertical tangent line at \\((1,0)\\). At \\(p = (0,1)\\): \\(J = (0, 2)\\), so \\(T_pV = \\ker(0, 2) = \\text{span}(1, 0)\\). This is the horizontal tangent line at \\((0,1)\\).'
                },
                {
                    question: 'Show that a derivation \\(D\\) at \\(p\\) must kill constants: \\(D(c) = 0\\) for all \\(c \\in k\\).',
                    hint: 'Use \\(D(1) = D(1 \\cdot 1)\\) and the Leibniz rule.',
                    solution: '\\(D(1) = D(1 \\cdot 1) = 1 \\cdot D(1) + 1 \\cdot D(1) = 2D(1)\\), so \\(D(1) = 0\\). By linearity, \\(D(c) = cD(1) = 0\\) for all \\(c \\in k\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Smooth Points
        // ================================================================
        {
            id: 'sec-smooth',
            title: 'Smooth Points',
            content: `
<h2>Smooth Points</h2>

<div class="env-block intuition">
    <div class="env-title">When Is a Point Smooth?</div>
    <div class="env-body">
        <p>A point on a curve in the plane is smooth when the curve has a well-defined tangent line there. When the tangent "line" becomes a whole plane (or higher), the point is singular. The algebraic criterion is elegant: a point is smooth when the tangent space has the "right" dimension.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 7.8 (Smooth and Singular Points)</div>
    <div class="env-body">
        <p>Let \\(V\\) be a variety of dimension \\(d\\) and \\(p \\in V\\). Then:</p>
        <ul>
            <li>\\(p\\) is a <strong>smooth</strong> (or <strong>nonsingular</strong>) point of \\(V\\) if \\(\\dim_k T_p V = d\\).</li>
            <li>\\(p\\) is a <strong>singular</strong> point if \\(\\dim_k T_p V > d\\).</li>
        </ul>
        <p>A variety is <strong>smooth</strong> (or <strong>nonsingular</strong>) if every point is smooth.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.9 (Jacobian Criterion)</div>
    <div class="env-body">
        <p>Let \\(V = V(f_1, \\ldots, f_r) \\subset \\mathbb{A}^n\\) with \\(\\dim V = d\\). A point \\(p \\in V\\) is smooth if and only if</p>
        \\[\\text{rank}\\, J(p) = n - d,\\]
        <p>where \\(J(p) = \\left(\\frac{\\partial f_i}{\\partial x_j}(p)\\right)\\) is the Jacobian matrix at \\(p\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>By Proposition 7.6, \\(\\dim T_p V = n - \\text{rank}\\, J(p)\\). So \\(\\dim T_p V = d\\) if and only if \\(\\text{rank}\\, J(p) = n - d\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Node \\(y^2 = x^2(x+1)\\)</div>
    <div class="env-body">
        <p>Let \\(V = V(y^2 - x^3 - x^2) \\subset \\mathbb{A}^2\\). This is a curve (\\(d = 1\\)). The Jacobian is</p>
        \\[J = (-3x^2 - 2x,\\; 2y).\\]
        <p>At the origin \\(p = (0,0)\\): \\(J(0,0) = (0, 0)\\), so \\(\\text{rank}\\, J = 0\\) and \\(\\dim T_p V = 2 > 1\\). The origin is singular (a node).</p>
        <p>At \\(p = (1, \\sqrt{2})\\): \\(J = (-5, 2\\sqrt{2})\\), rank 1, so this point is smooth.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Cusp \\(y^2 = x^3\\)</div>
    <div class="env-body">
        <p>Let \\(V = V(y^2 - x^3)\\). At the origin: \\(J(0,0) = (-3 \\cdot 0^2,\\; 2 \\cdot 0) = (0, 0)\\), so rank 0 and \\(\\dim T_p V = 2 > 1\\). The origin is a cusp singularity.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.10 (Generic Smoothness)</div>
    <div class="env-body">
        <p>The set of singular points of a variety \\(V\\) is a proper closed subset. In particular, the smooth locus is a dense open subset of \\(V\\).</p>
    </div>
</div>

<p>This means singularities are "rare" in the Zariski topology: most points are smooth.</p>

<div class="viz-placeholder" data-viz="viz-smooth-vs-singular"></div>
<div class="viz-placeholder" data-viz="viz-tangent-plane"></div>
`,
            visualizations: [
                {
                    id: 'viz-smooth-vs-singular',
                    title: 'Smooth vs. Singular: Tangent Space Dimension',
                    description: 'Three curves compared. At a smooth point, \\(\\dim T_p V = 1 = \\dim V\\). At the node and cusp, \\(\\dim T_p V = 2 > 1 = \\dim V\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var ctx = viz.ctx;

                        function drawCurvePanel(cx, cy, w, h, title, curveFn, curveFn2, singPt, tangentInfo) {
                            // Background
                            ctx.fillStyle = '#12122a';
                            ctx.fillRect(cx, cy, w, h);
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(cx, cy, w, h);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(title, cx + w/2, cy + 6);

                            // Local coordinate system
                            var ox = cx + w/2;
                            var oy = cy + h * 0.6;
                            var sc = w * 0.18;

                            // Mini axes
                            ctx.strokeStyle = viz.colors.axis + '44';
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(cx + 10, oy); ctx.lineTo(cx + w - 10, oy); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(ox, cy + 30); ctx.lineTo(ox, cy + h - 20); ctx.stroke();

                            // Draw curve
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 200; i++) {
                                var t = -2.5 + 5 * i / 200;
                                var yv = curveFn(t);
                                if (!isFinite(yv)) { started = false; continue; }
                                var sx = ox + t * sc;
                                var sy = oy - yv * sc;
                                if (sx < cx + 5 || sx > cx + w - 5 || sy < cy + 25 || sy > cy + h - 15) { started = false; continue; }
                                if (!started) { ctx.moveTo(sx, sy); started = true; }
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            if (curveFn2) {
                                ctx.beginPath();
                                started = false;
                                for (var i2 = 0; i2 <= 200; i2++) {
                                    var t2 = -2.5 + 5 * i2 / 200;
                                    var yv2 = curveFn2(t2);
                                    if (!isFinite(yv2)) { started = false; continue; }
                                    var sx2 = ox + t2 * sc;
                                    var sy2 = oy - yv2 * sc;
                                    if (sx2 < cx + 5 || sx2 > cx + w - 5 || sy2 < cy + 25 || sy2 > cy + h - 15) { started = false; continue; }
                                    if (!started) { ctx.moveTo(sx2, sy2); started = true; }
                                    else ctx.lineTo(sx2, sy2);
                                }
                                ctx.stroke();
                            }

                            // Singular/smooth point
                            var spx = ox + singPt[0] * sc;
                            var spy = oy - singPt[1] * sc;
                            ctx.fillStyle = tangentInfo.singular ? viz.colors.red : viz.colors.green;
                            ctx.beginPath(); ctx.arc(spx, spy, 5, 0, Math.PI * 2); ctx.fill();

                            // Tangent visualization
                            if (tangentInfo.singular) {
                                // Full 2D tangent "space" shown as translucent region
                                ctx.fillStyle = viz.colors.red + '22';
                                ctx.fillRect(cx + 10, cy + 25, w - 20, h - 45);
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('dim T_p = 2 > dim V = 1', cx + w/2, cy + h - 8);
                                ctx.fillText('SINGULAR', cx + w/2, cy + h - 22);
                            } else {
                                // Tangent line
                                var tSlope = tangentInfo.slope;
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(spx - 40, spy + 40 * tSlope);
                                ctx.lineTo(spx + 40, spy - 40 * tSlope);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('dim T_p = 1 = dim V', cx + w/2, cy + h - 8);
                                ctx.fillText('SMOOTH', cx + w/2, cy + h - 22);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var pw = 175;
                            var ph = 350;
                            var gap = 12;
                            var startX = (viz.width - 3 * pw - 2 * gap) / 2;

                            // Panel 1: Smooth parabola
                            drawCurvePanel(startX, 15, pw, ph,
                                'y = x\u00B2 (smooth)',
                                function(t) { return t * t; }, null,
                                [1, 1],
                                { singular: false, slope: 0.5 }
                            );

                            // Panel 2: Node y^2 = x^2(x+1)
                            drawCurvePanel(startX + pw + gap, 15, pw, ph,
                                'y\u00B2 = x\u00B2(x+1) (node)',
                                function(t) { var val = t*t*(t+1); return val >= 0 ? Math.sqrt(val) : NaN; },
                                function(t) { var val = t*t*(t+1); return val >= 0 ? -Math.sqrt(val) : NaN; },
                                [0, 0],
                                { singular: true }
                            );

                            // Panel 3: Cusp y^2 = x^3
                            drawCurvePanel(startX + 2*(pw + gap), 15, pw, ph,
                                'y\u00B2 = x\u00B3 (cusp)',
                                function(t) { return t >= 0 ? Math.pow(t, 1.5) : NaN; },
                                function(t) { return t >= 0 ? -Math.pow(t, 1.5) : NaN; },
                                [0, 0],
                                { singular: true }
                            );
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-tangent-plane',
                    title: 'Tangent Plane to a Surface',
                    description: 'A surface \\(z = x^2 + y^2\\) (paraboloid) with a tangent plane at a draggable point. At each smooth point, the tangent plane has dimension 2 = dim V.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 280, scale: 40
                        });

                        var px = 1.5, py = 1.0;
                        VizEngine.createSlider(controls, 'x\u2080', -2, 2, px, 0.1, function(v) { px = v; });
                        VizEngine.createSlider(controls, 'y\u2080', -2, 2, py, 0.1, function(v) { py = v; });

                        // Simple oblique projection
                        function project(x, y, z) {
                            var angle = 0.5;
                            var sx = x - y * Math.cos(angle) * 0.5;
                            var sy = -z + y * Math.sin(angle) * 0.5;
                            return [viz.originX + sx * viz.scale, viz.originY + sy * viz.scale];
                        }

                        viz.animate(function() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            var ox = project(0, 0, 0);
                            var ax = project(3, 0, 0);
                            var ay = project(0, 3, 0);
                            var az = project(0, 0, 4);
                            ctx.beginPath(); ctx.moveTo(ox[0], ox[1]); ctx.lineTo(ax[0], ax[1]); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(ox[0], ox[1]); ctx.lineTo(ay[0], ay[1]); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(ox[0], ox[1]); ctx.lineTo(az[0], az[1]); ctx.stroke();
                            viz.screenText('x', ax[0] + 10, ax[1], viz.colors.text, 11);
                            viz.screenText('y', ay[0] + 10, ay[1], viz.colors.text, 11);
                            viz.screenText('z', az[0], az[1] - 10, viz.colors.text, 11);

                            // Surface wireframe: z = x^2 + y^2
                            ctx.strokeStyle = viz.colors.blue + '44';
                            ctx.lineWidth = 0.8;
                            for (var u = -2; u <= 2; u += 0.4) {
                                ctx.beginPath();
                                for (var v2 = -2; v2 <= 2; v2 += 0.1) {
                                    var z = u*u + v2*v2;
                                    if (z > 8) continue;
                                    var pp = project(u, v2, z);
                                    v2 === -2 ? ctx.moveTo(pp[0], pp[1]) : ctx.lineTo(pp[0], pp[1]);
                                }
                                ctx.stroke();
                            }
                            for (var v3 = -2; v3 <= 2; v3 += 0.4) {
                                ctx.beginPath();
                                for (var u2 = -2; u2 <= 2; u2 += 0.1) {
                                    var z2 = u2*u2 + v3*v3;
                                    if (z2 > 8) continue;
                                    var pp2 = project(u2, v3, z2);
                                    u2 === -2 ? ctx.moveTo(pp2[0], pp2[1]) : ctx.lineTo(pp2[0], pp2[1]);
                                }
                                ctx.stroke();
                            }

                            // Tangent plane at (px, py, px^2+py^2)
                            // z - z0 = 2x0(x-x0) + 2y0(y-y0)
                            var z0 = px*px + py*py;
                            var dzdx = 2*px, dzdy = 2*py;
                            // Draw tangent plane as filled quad
                            var planeR = 1.0;
                            var corners = [
                                [-planeR, -planeR], [planeR, -planeR],
                                [planeR, planeR], [-planeR, planeR]
                            ];
                            ctx.fillStyle = viz.colors.orange + '33';
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var ci = 0; ci < 4; ci++) {
                                var dx = corners[ci][0], dy = corners[ci][1];
                                var tz = z0 + dzdx * dx + dzdy * dy;
                                var tp = project(px + dx, py + dy, tz);
                                ci === 0 ? ctx.moveTo(tp[0], tp[1]) : ctx.lineTo(tp[0], tp[1]);
                            }
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();

                            // Point
                            var pp0 = project(px, py, z0);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(pp0[0], pp0[1], 5, 0, Math.PI * 2); ctx.fill();

                            // Labels
                            viz.screenText('z = x\u00B2 + y\u00B2', 80, 25, viz.colors.blue, 13);
                            viz.screenText('p = (' + px.toFixed(1) + ', ' + py.toFixed(1) + ', ' + z0.toFixed(1) + ')', viz.width / 2, viz.height - 40, viz.colors.teal, 12);
                            viz.screenText('T_pV: z \u2212 ' + z0.toFixed(1) + ' = ' + dzdx.toFixed(1) + '(x\u2212' + px.toFixed(1) + ') + ' + dzdy.toFixed(1) + '(y\u2212' + py.toFixed(1) + ')', viz.width / 2, viz.height - 20, viz.colors.orange, 11);
                        });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find all singular points of \\(V(y^2 - x^3) \\subset \\mathbb{A}^2\\).',
                    hint: 'Set both partial derivatives equal to zero simultaneously, and check which solutions lie on the curve.',
                    solution: 'We need \\(\\partial(y^2 - x^3)/\\partial x = -3x^2 = 0\\) and \\(\\partial(y^2 - x^3)/\\partial y = 2y = 0\\), giving \\(x = y = 0\\). Check: \\((0,0) \\in V\\). So the origin is the only singular point (a cusp).'
                },
                {
                    question: 'Let \\(V = V(x^2 + y^2 + z^2 - 1) \\subset \\mathbb{A}^3\\). Show that \\(V\\) is smooth (over a field of characteristic \\(\\neq 2\\)).',
                    hint: 'The Jacobian is \\((2x, 2y, 2z)\\). For this to have rank 0, all coordinates must be zero. Is \\((0,0,0)\\) on \\(V\\)?',
                    solution: 'The Jacobian is \\(J = (2x, 2y, 2z)\\). This has rank 0 only if \\(x = y = z = 0\\), but \\(0^2 + 0^2 + 0^2 = 0 \\neq 1\\), so \\((0,0,0) \\notin V\\). At every point of \\(V\\), the Jacobian has rank \\(\\geq 1\\). Since \\(\\dim V = 3 - 1 = 2\\), we need \\(\\text{rank}\\, J = 1\\), which is satisfied everywhere on \\(V\\). So \\(V\\) is smooth.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Differentials
        // ================================================================
        {
            id: 'sec-differential',
            title: 'Differentials',
            content: `
<h2>Differentials</h2>

<div class="env-block intuition">
    <div class="env-title">From Functions to Linear Functionals</div>
    <div class="env-body">
        <p>In calculus, the differential \\(df\\) of a function \\(f\\) at a point \\(p\\) is the linear map that best approximates \\(f - f(p)\\) near \\(p\\). It acts on tangent vectors: \\(df(v) = v(f)\\). In algebraic geometry, we can define the same thing using our algebraic tangent space.</p>
    </div>
</div>

<h3>The Differential of a Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition 7.11 (Differential)</div>
    <div class="env-body">
        <p>Let \\(f \\in \\mathcal{O}_{V,p}\\). The <strong>differential</strong> of \\(f\\) at \\(p\\) is the element</p>
        \\[d_p f = (f - f(p)) \\bmod \\mathfrak{m}_p^2 \\;\\in\\; \\mathfrak{m}_p / \\mathfrak{m}_p^2.\\]
        <p>Equivalently, \\(d_p f\\) is the linear functional on \\(T_p V\\) defined by \\(d_p f(D) = D(f)\\) for every derivation \\(D \\in T_p V\\).</p>
    </div>
</div>

<p>The differential \\(d_p f\\) lives in the <strong>cotangent space</strong> \\(\\mathfrak{m}_p / \\mathfrak{m}_p^2\\). It extracts the "linear part" of \\(f - f(p)\\).</p>

<h3>Basic Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Proposition 7.12 (Properties of Differentials)</div>
    <div class="env-body">
        <p>For \\(f, g \\in \\mathcal{O}_{V,p}\\) and \\(c \\in k\\):</p>
        <ol>
            <li><strong>Linearity:</strong> \\(d_p(f + g) = d_p f + d_p g\\) and \\(d_p(cf) = c \\cdot d_p f\\).</li>
            <li><strong>Leibniz rule:</strong> \\(d_p(fg) = f(p) \\cdot d_p g + g(p) \\cdot d_p f\\).</li>
            <li><strong>Constants:</strong> \\(d_p c = 0\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of the Leibniz Rule</div>
    <div class="env-body">
        <p>Write \\(f = f(p) + \\tilde{f}\\) and \\(g = g(p) + \\tilde{g}\\) where \\(\\tilde{f}, \\tilde{g} \\in \\mathfrak{m}_p\\). Then</p>
        \\[fg - (fg)(p) = f(p)\\tilde{g} + g(p)\\tilde{f} + \\tilde{f}\\tilde{g}.\\]
        <p>Since \\(\\tilde{f}\\tilde{g} \\in \\mathfrak{m}_p^2\\), it vanishes modulo \\(\\mathfrak{m}_p^2\\), giving \\(d_p(fg) = f(p) d_p g + g(p) d_p f\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Coordinate Differentials</h3>

<div class="env-block example">
    <div class="env-title">Example: Differentials in \\(\\mathbb{A}^n\\)</div>
    <div class="env-body">
        <p>In \\(\\mathbb{A}^n\\) at the origin, the coordinate functions \\(x_1, \\ldots, x_n\\) give differentials \\(dx_1, \\ldots, dx_n\\) which form a <em>basis</em> for the cotangent space. For any \\(f \\in \\mathfrak{m}_0\\):</p>
        \\[d_0 f = \\sum_{j=1}^n \\frac{\\partial f}{\\partial x_j}(0)\\, dx_j.\\]
        <p>This is the familiar formula from multivariable calculus, now justified algebraically.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Differential on a Variety</div>
    <div class="env-body">
        <p>On \\(V = V(x^2 + y^2 - 1)\\) at \\(p = (1, 0)\\), the cotangent space is 1-dimensional. We have \\(d_p(x^2 + y^2 - 1) = 2dx + 0\\cdot dy = 2dx = 0\\) in the cotangent space of \\(V\\). So \\(dx = 0\\) in \\(\\mathfrak{m}_p/\\mathfrak{m}_p^2\\), and \\(dy\\) alone spans the cotangent space. The differential of any function \\(f\\) on \\(V\\) is proportional to \\(dy\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cotangent"></div>
`,
            visualizations: [
                {
                    id: 'viz-cotangent',
                    title: 'Differential as a Linear Functional',
                    description: 'The function \\(f(x,y) = x^2 + y\\) has differential \\(d_p f = 2x_0\\,dx + dy\\) at \\(p = (x_0, y_0)\\). Drag \\(p\\) and see how \\(d_p f\\) acts on tangent vectors: it returns the directional derivative.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 50
                        });

                        var pt = viz.addDraggable('p', 1, 0, viz.colors.teal, 8);

                        viz.animate(function() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();

                            // Level curves of f(x,y) = x^2 + y
                            var ctx = viz.ctx;
                            for (var c = -3; c <= 5; c += 0.5) {
                                // x^2 + y = c  =>  y = c - x^2
                                ctx.strokeStyle = viz.colors.purple + '33';
                                ctx.lineWidth = 0.8;
                                ctx.beginPath();
                                var started = false;
                                for (var i = 0; i <= 200; i++) {
                                    var xx = -5 + 10 * i / 200;
                                    var yy = c - xx * xx;
                                    var sp = viz.toScreen(xx, yy);
                                    if (sp[1] < 0 || sp[1] > viz.height) { started = false; continue; }
                                    if (!started) { ctx.moveTo(sp[0], sp[1]); started = true; }
                                    else ctx.lineTo(sp[0], sp[1]);
                                }
                                ctx.stroke();
                            }

                            // Gradient at p: df = (2x0, 1)
                            var gx = 2 * pt.x;
                            var gy = 1;
                            var glen = Math.sqrt(gx * gx + gy * gy);

                            // Draw gradient vector (normalized for display)
                            var scale = 1.5 / glen;
                            viz.drawVector(pt.x, pt.y, pt.x + gx * scale, pt.y + gy * scale, viz.colors.orange, 'df', 2);

                            // Level curve through p: y = f(p) - x^2 where f(p) = x0^2 + y0
                            var fp = pt.x * pt.x + pt.y;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            started = false;
                            for (var i2 = 0; i2 <= 300; i2++) {
                                var xx2 = -5 + 10 * i2 / 300;
                                var yy2 = fp - xx2 * xx2;
                                var sp2 = viz.toScreen(xx2, yy2);
                                if (sp2[1] < 0 || sp2[1] > viz.height) { started = false; continue; }
                                if (!started) { ctx.moveTo(sp2[0], sp2[1]); started = true; }
                                else ctx.lineTo(sp2[0], sp2[1]);
                            }
                            ctx.stroke();

                            viz.drawPoint(pt.x, pt.y, viz.colors.teal, 'p', 6);

                            // Info
                            viz.screenText('f(x,y) = x\u00B2 + y', 80, 20, viz.colors.purple, 12);
                            viz.screenText('f(p) = ' + fp.toFixed(2), 80, 38, viz.colors.blue, 11);
                            viz.screenText('d_p f = ' + gx.toFixed(1) + ' dx + 1 dy', viz.width / 2, viz.height - 20, viz.colors.orange, 12);
                            viz.screenText('Level curve f = ' + fp.toFixed(1) + ' (blue)     Gradient (orange)', viz.width / 2, viz.height - 40, viz.colors.text, 10);
                        });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(f = x^3 y + y^2\\) and \\(p = (1, -1)\\). Compute \\(d_p f\\) and evaluate it on the tangent vector \\(v = (2, 3)\\).',
                    hint: '\\(d_p f = f_x(p)\\,dx + f_y(p)\\,dy\\). Then \\(d_p f(v) = f_x(p) \\cdot 2 + f_y(p) \\cdot 3\\).',
                    solution: '\\(f_x = 3x^2 y\\), \\(f_y = x^3 + 2y\\). At \\(p = (1,-1)\\): \\(f_x(p) = -3\\), \\(f_y(p) = 1 - 2 = -1\\). So \\(d_p f = -3\\,dx - dy\\). On \\(v = (2,3)\\): \\(d_p f(v) = -3 \\cdot 2 + (-1) \\cdot 3 = -9\\).'
                },
                {
                    question: 'Show that if \\(f\\) vanishes to second order at \\(p\\) (i.e., \\(f \\in \\mathfrak{m}_p^2\\)), then \\(d_p f = 0\\).',
                    hint: 'What is \\(f - f(p)\\) modulo \\(\\mathfrak{m}_p^2\\) when \\(f \\in \\mathfrak{m}_p^2\\)?',
                    solution: 'If \\(f \\in \\mathfrak{m}_p^2\\), then \\(f(p) = 0\\) and \\(f - f(p) = f \\in \\mathfrak{m}_p^2\\). So \\(d_p f = f \\bmod \\mathfrak{m}_p^2 = 0\\). Intuitively, if \\(f\\) vanishes to second order, its "linear part" is zero.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From Local to Global</h2>

<div class="env-block intuition">
    <div class="env-title">What We Have Built</div>
    <div class="env-body">
        <p>This chapter established the local algebra of a variety: at each point \\(p\\), we have the local ring \\(\\mathcal{O}_{V,p}\\), its maximal ideal \\(\\mathfrak{m}_p\\), and the tangent/cotangent spaces \\(T_pV\\) and \\(\\mathfrak{m}_p/\\mathfrak{m}_p^2\\). Smoothness is the condition that these spaces have the expected dimension.</p>
    </div>
</div>

<h3>Summary of Key Ideas</h3>

<table style="width:100%; border-collapse:collapse; margin:1em 0;">
<tr style="border-bottom:2px solid #30363d;">
    <th style="text-align:left; padding:8px; color:var(--accent-blue);">Algebra</th>
    <th style="text-align:left; padding:8px; color:var(--accent-teal);">Geometry</th>
</tr>
<tr style="border-bottom:1px solid #21262d;">
    <td style="padding:8px;">\\(\\mathcal{O}_{V,p}\\) (local ring)</td>
    <td style="padding:8px;">Functions defined near \\(p\\)</td>
</tr>
<tr style="border-bottom:1px solid #21262d;">
    <td style="padding:8px;">\\(\\mathfrak{m}_p\\) (maximal ideal)</td>
    <td style="padding:8px;">Functions vanishing at \\(p\\)</td>
</tr>
<tr style="border-bottom:1px solid #21262d;">
    <td style="padding:8px;">\\(\\mathfrak{m}_p / \\mathfrak{m}_p^2\\) (cotangent space)</td>
    <td style="padding:8px;">Linear approximations at \\(p\\)</td>
</tr>
<tr style="border-bottom:1px solid #21262d;">
    <td style="padding:8px;">\\(T_p V = (\\mathfrak{m}_p/\\mathfrak{m}_p^2)^*\\)</td>
    <td style="padding:8px;">Tangent space at \\(p\\)</td>
</tr>
<tr style="border-bottom:1px solid #21262d;">
    <td style="padding:8px;">\\(\\dim T_p V = \\dim V\\)</td>
    <td style="padding:8px;">Smooth point</td>
</tr>
<tr>
    <td style="padding:8px;">\\(\\dim T_p V > \\dim V\\)</td>
    <td style="padding:8px;">Singular point</td>
</tr>
</table>

<h3>What Comes Next</h3>

<p>Now that we can detect singularities, the natural question is: <strong>can we resolve them?</strong> Chapter 8 introduces <em>blowups</em>, the fundamental operation that replaces a singular point by something smoother. The tangent space machinery from this chapter will be essential, because a blowup separates tangent directions at a singular point.</p>

<p>Beyond singularity resolution, the local ring perspective leads to the theory of <em>schemes</em> (Part D). Grothendieck's key insight was that a scheme is determined by its collection of local rings, one at each point. The local story we developed here is the foundation of that global theory.</p>

<div class="env-block remark">
    <div class="env-title">The Bigger Picture</div>
    <div class="env-body">
        <p>The correspondence between local algebra and local geometry is one of the deepest themes in algebraic geometry. Zariski's work showed that local rings are the right invariant for local geometry. Grothendieck went further: in the theory of schemes, a geometric space <em>is</em> the assignment of a local ring to every point. This "sheaf of local rings" (which we will meet in Chapter 10) is the central object of modern algebraic geometry.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-jacobian-rank"></div>
`,
            visualizations: [
                {
                    id: 'viz-jacobian-rank',
                    title: 'Jacobian Rank & Singularity Detection',
                    description: 'Explore the curve \\(V(y^2 - x^3 - ax - b)\\). Adjust \\(a\\) and \\(b\\) to create or remove singularities. The Jacobian rank is computed at each point; rank deficiency (red) indicates a singularity.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 55
                        });

                        var aVal = -1, bVal = 0;
                        VizEngine.createSlider(controls, 'a', -3, 3, aVal, 0.1, function(v) { aVal = v; });
                        VizEngine.createSlider(controls, 'b', -3, 3, bVal, 0.1, function(v) { bVal = v; });

                        function curvePosY(x) {
                            var val = x*x*x + aVal*x + bVal;
                            return val >= 0 ? Math.sqrt(val) : NaN;
                        }
                        function curveNegY(x) {
                            var val = x*x*x + aVal*x + bVal;
                            return val >= 0 ? -Math.sqrt(val) : NaN;
                        }

                        // Find singular points: 3x^2 + a = 0 and 2y = 0 => y=0, x^3 + ax + b = 0 and 3x^2 + a = 0
                        function findSingular() {
                            var pts = [];
                            // y=0, so x^3 + ax + b = 0 and 3x^2 + a = 0
                            // From 3x^2 + a = 0: x^2 = -a/3
                            if (-aVal/3 >= 0) {
                                var xc = Math.sqrt(-aVal/3);
                                var candidates = [xc, -xc];
                                for (var ci = 0; ci < candidates.length; ci++) {
                                    var xx = candidates[ci];
                                    var residual = Math.abs(xx*xx*xx + aVal*xx + bVal);
                                    if (residual < 0.15) {
                                        pts.push([xx, 0]);
                                    }
                                }
                            }
                            return pts;
                        }

                        // Discriminant: -4a^3 - 27b^2
                        function discriminant() {
                            return -4 * aVal * aVal * aVal - 27 * bVal * bVal;
                        }

                        viz.animate(function() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();

                            // Draw curve
                            viz.drawFunction(curvePosY, -5, 5, viz.colors.blue, 2, 500);
                            viz.drawFunction(curveNegY, -5, 5, viz.colors.blue, 2, 500);

                            // Mark singular points
                            var sings = findSingular();
                            for (var si = 0; si < sings.length; si++) {
                                viz.drawPoint(sings[si][0], sings[si][1], viz.colors.red, 'sing', 7);
                                // Draw "2D tangent space" indicator
                                var ctx = viz.ctx;
                                var sp = viz.toScreen(sings[si][0], sings[si][1]);
                                ctx.fillStyle = viz.colors.red + '22';
                                ctx.fillRect(sp[0] - 30, sp[1] - 30, 60, 60);
                            }

                            // Info
                            var disc = discriminant();
                            viz.screenText('y\u00B2 = x\u00B3 + (' + aVal.toFixed(1) + ')x + (' + bVal.toFixed(1) + ')', viz.width / 2, 20, viz.colors.blue, 13);
                            viz.screenText('\u0394 = \u22124a\u00B3 \u2212 27b\u00B2 = ' + disc.toFixed(1), viz.width / 2, viz.height - 40, viz.colors.text, 11);

                            if (Math.abs(disc) < 0.5) {
                                viz.screenText('Discriminant \u2248 0: curve is singular!', viz.width / 2, viz.height - 20, viz.colors.red, 12);
                            } else if (disc > 0) {
                                viz.screenText('Discriminant > 0: curve is smooth', viz.width / 2, viz.height - 20, viz.colors.green, 12);
                            } else {
                                viz.screenText('Discriminant < 0: curve is smooth', viz.width / 2, viz.height - 20, viz.colors.green, 12);
                            }

                            if (sings.length > 0) {
                                viz.screenText('J(p) = (' + (3*sings[0][0]*sings[0][0] + aVal).toFixed(1) + ', ' + (2*sings[0][1]).toFixed(1) + ') \u2014 rank 0!', viz.width / 2, viz.height - 58, viz.colors.red, 11);
                            }
                        });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Consider the surface \\(V = V(x^2 + y^3 + z^5) \\subset \\mathbb{A}^3\\). Determine the singular locus of \\(V\\).',
                    hint: 'Compute the Jacobian \\((2x, 3y^2, 5z^4)\\) and find where it has rank 0 on \\(V\\).',
                    solution: 'The Jacobian is \\(J = (2x, 3y^2, 5z^4)\\). This has rank 0 iff \\(x = 0\\), \\(y = 0\\), \\(z = 0\\). Check: \\(0 + 0 + 0 = 0\\), so \\((0,0,0) \\in V\\). The singular locus is \\(\\{(0,0,0)\\}\\), a single point (this is an \\(E_8\\) singularity).'
                },
                {
                    question: 'Let \\(V = V(y^2 - x^3 - ax - b) \\subset \\mathbb{A}^2\\) where \\(a, b \\in k\\). Show that \\(V\\) is singular if and only if the discriminant \\(\\Delta = -4a^3 - 27b^2 = 0\\).',
                    hint: 'A singular point requires \\(-3x^2 - a = 0\\) (so \\(x^2 = -a/3\\)) and \\(2y = 0\\) (so \\(y = 0\\)), plus \\(x^3 + ax + b = 0\\). Eliminate \\(x\\).',
                    solution: 'Singular points: \\(y = 0\\), \\(x^2 = -a/3\\), and \\(x^3 + ax + b = 0\\). From \\(x^2 = -a/3\\): \\(x^3 = -ax/3\\). Substituting: \\(-ax/3 + ax + b = 2ax/3 + b = 0\\), so \\(x = -3b/(2a)\\) (assuming \\(a \\neq 0\\)). Then \\(x^2 = 9b^2/(4a^2) = -a/3\\), giving \\(27b^2 = -4a^3\\), i.e., \\(\\Delta = -4a^3 - 27b^2 = 0\\). (The case \\(a = 0\\) gives \\(b = 0\\) directly.)'
                }
            ]
        }
    ]
});
