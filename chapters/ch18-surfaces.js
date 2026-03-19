window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: 'Surfaces & Higher Dimensions',
    subtitle: 'From curves to surfaces: intersection theory and classification',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why Surfaces?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Surfaces?',
            content: `
<div class="bridge opening-bridge">
    <p><strong>From curves to surfaces.</strong> Throughout this course we have studied algebraic curves in great depth: their genus, divisors, line bundles, and the Riemann-Roch theorem. But algebraic geometry is not limited to one-dimensional objects. Surfaces (dimension 2 varieties) are the next frontier, and they reveal phenomena with no analogue in curve theory: self-intersection of curves on a surface, the interplay between the canonical class and the geometry of the surface, and the rich classification theory of Enriques and Kodaira. In higher dimensions still, the Minimal Model Program extends these ideas into a deep structural theory of algebraic varieties.</p>
</div>

<div class="bridge section-roadmap">
    <p><strong>Section goal:</strong> Motivate the passage from curves to surfaces, preview the key new phenomena that arise, and set up the framework for the rest of the chapter.</p>
</div>

<div class="env-block intuition">
    <div class="env-title">From Curves to Surfaces</div>
    <div class="env-body">
        <p>A smooth algebraic curve \\(C\\) is (over \\(\\mathbb{C}\\)) a Riemann surface. A smooth algebraic surface \\(S\\) is a complex manifold of real dimension 4. The jump from 1 to 2 complex dimensions introduces qualitative new features:</p>
        <ul>
            <li><strong>Curves <em>on</em> the surface</strong> replace points on a curve. Divisors on \\(S\\) are formal sums of irreducible curves, not points.</li>
            <li><strong>Intersection numbers</strong> between curves on \\(S\\) become the fundamental invariant, generalizing the degree of a divisor on a curve.</li>
            <li><strong>Self-intersection</strong> makes sense: a curve \\(C \\subset S\\) has an integer \\(C^2 = C \\cdot C\\), which measures how \\(C\\) "sits" in \\(S\\). Nothing like this exists for points on a curve.</li>
            <li><strong>Birational geometry</strong> is richer: blowing up a point on a surface creates a new curve (the exceptional divisor) with \\(E^2 = -1\\), and the process is not trivially reversible as it is for curves.</li>
        </ul>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Algebraic Surface)</div>
    <div class="env-body">
        <p>An <strong>algebraic surface</strong> is an irreducible algebraic variety of dimension 2 over an algebraically closed field \\(k\\). We will typically work with smooth projective surfaces over \\(k = \\mathbb{C}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Key Examples</div>
    <div class="env-body">
        <ol>
            <li><strong>Projective plane</strong> \\(\\mathbb{P}^2\\): the simplest surface. Lines are degree-1 curves, conics are degree-2 curves.</li>
            <li><strong>Product surfaces</strong> \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\): a ruled surface (quadric in \\(\\mathbb{P}^3\\)).</li>
            <li><strong>Cubic surfaces</strong> in \\(\\mathbb{P}^3\\): smooth cubics contain exactly 27 lines, one of the most celebrated results in 19th-century geometry.</li>
            <li><strong>K3 surfaces</strong>: smooth surfaces with \\(K_S \\sim 0\\) and \\(H^1(S, \\mathcal{O}_S) = 0\\). These are the surface analogue of elliptic curves in some sense.</li>
            <li><strong>Abelian surfaces</strong>: 2-dimensional abelian varieties (complex tori that embed into projective space).</li>
        </ol>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">What's New Compared to Curves</div>
    <div class="env-body">
        <p>For curves, birational equivalence implies isomorphism (for smooth projective curves). For surfaces, this fails dramatically: you can blow up \\(\\mathbb{P}^2\\) at any number of points and get birationally equivalent but non-isomorphic surfaces. This leads to the concept of <em>minimal models</em>, which we will develop in Section 5.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Intersection Theory on Surfaces
        // ================================================================
        {
            id: 'sec-intersection',
            title: 'Intersection Theory on Surfaces',
            content: `
<div class="bridge section-roadmap">
    <p><strong>Section goal:</strong> Define the intersection pairing \\(C \\cdot D\\) for divisors on a surface, establish the adjunction formula, and compute self-intersection numbers.</p>
</div>

<h2>The Intersection Pairing</h2>

<div class="env-block intuition">
    <div class="env-title">Counting Intersections Properly</div>
    <div class="env-body">
        <p>On \\(\\mathbb{P}^2\\), two distinct lines meet in exactly one point. A line and a conic meet in two points (counted with multiplicity). This is Bezout's theorem from Chapter 6. On an arbitrary surface \\(S\\), we want a bilinear pairing \\(C \\cdot D\\) on divisors that generalizes this.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Intersection Number)</div>
    <div class="env-body">
        <p>Let \\(S\\) be a smooth projective surface and \\(C, D\\) divisors on \\(S\\). The <strong>intersection number</strong> \\(C \\cdot D \\in \\mathbb{Z}\\) is defined by:</p>
        <ol>
            <li>If \\(C\\) and \\(D\\) are distinct irreducible curves meeting transversally, then \\(C \\cdot D = \\#(C \\cap D)\\), the number of intersection points.</li>
            <li>In general, \\(C \\cdot D = \\chi(\\mathcal{O}_S) - \\chi(\\mathcal{O}_S(-C)) - \\chi(\\mathcal{O}_S(-D)) + \\chi(\\mathcal{O}_S(-C-D))\\).</li>
        </ol>
        <p>Equivalently, if \\(\\mathcal{L}, \\mathcal{M}\\) are the line bundles corresponding to \\(C, D\\), then \\(C \\cdot D = \\deg(\\mathcal{L}|_D) = \\deg(\\mathcal{M}|_C)\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.1 (Properties of the Intersection Pairing)</div>
    <div class="env-body">
        <p>The intersection pairing \\(\\operatorname{Pic}(S) \\times \\operatorname{Pic}(S) \\to \\mathbb{Z}\\) satisfies:</p>
        <ol>
            <li><strong>Bilinearity:</strong> \\((C_1 + C_2) \\cdot D = C_1 \\cdot D + C_2 \\cdot D\\).</li>
            <li><strong>Symmetry:</strong> \\(C \\cdot D = D \\cdot C\\).</li>
            <li><strong>Numerical equivalence:</strong> \\(C \\cdot D\\) depends only on the linear equivalence classes of \\(C\\) and \\(D\\).</li>
            <li><strong>Positivity:</strong> If \\(C\\) and \\(D\\) are effective with no common component, then \\(C \\cdot D \\geq 0\\).</li>
        </ol>
    </div>
</div>

<h3>Self-Intersection</h3>

<div class="env-block intuition">
    <div class="env-title">What Does \\(C^2\\) Mean?</div>
    <div class="env-body">
        <p>The self-intersection \\(C^2 = C \\cdot C\\) seems paradoxical: a curve always intersects itself everywhere! The resolution is to use <em>linear equivalence</em>: deform \\(C\\) slightly to a linearly equivalent curve \\(C'\\), and count \\(C \\cdot C' = C^2\\). The self-intersection measures how much \\(C\\) "moves" in the surface.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Lines in \\(\\mathbb{P}^2\\)</div>
    <div class="env-body">
        <p>Let \\(L\\) be a line in \\(\\mathbb{P}^2\\). Another line \\(L'\\) meets \\(L\\) in exactly one point, so \\(L^2 = L \\cdot L' = 1\\). More generally, if \\(C\\) is a degree-\\(d\\) curve in \\(\\mathbb{P}^2\\), then \\(C^2 = d^2\\) (by Bezout).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Fibers of a Ruling</div>
    <div class="env-body">
        <p>On \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\), let \\(F = \\{p\\} \\times \\mathbb{P}^1\\) be a fiber of the first projection. Two such fibers (for distinct \\(p, p'\\)) are disjoint, so \\(F^2 = 0\\). Similarly for fibers \\(G\\) of the second projection: \\(G^2 = 0\\), but \\(F \\cdot G = 1\\).</p>
    </div>
</div>

<h3>The Adjunction Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.2 (Adjunction Formula)</div>
    <div class="env-body">
        <p>Let \\(C\\) be a smooth curve on a smooth surface \\(S\\). Then</p>
        \\[2g(C) - 2 = C^2 + K_S \\cdot C,\\]
        <p>where \\(g(C)\\) is the genus of \\(C\\) and \\(K_S\\) is the canonical divisor of \\(S\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>From the short exact sequence of sheaves \\(0 \\to \\mathcal{O}_S(-C) \\to \\mathcal{O}_S \\to \\mathcal{O}_C \\to 0\\), tensoring with \\(\\omega_S(C)\\) and using the adjunction \\(\\omega_C = (\\omega_S \\otimes \\mathcal{O}_S(C))|_C\\), we get \\(\\deg \\omega_C = (K_S + C) \\cdot C\\). Since \\(\\deg \\omega_C = 2g(C) - 2\\), the result follows.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Genus of a Plane Curve</div>
    <div class="env-body">
        <p>On \\(\\mathbb{P}^2\\), the canonical class is \\(K_{\\mathbb{P}^2} = -3H\\) where \\(H\\) is a line. For a smooth curve \\(C\\) of degree \\(d\\), \\(C \\sim dH\\), so:</p>
        \\[2g - 2 = d^2 + (-3) \\cdot d = d^2 - 3d = d(d-3).\\]
        <p>Thus \\(g = \\frac{(d-1)(d-2)}{2}\\), recovering the genus formula from Chapter 9.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-intersection-surface"></div>
<div class="viz-placeholder" data-viz="viz-self-intersection"></div>
`,
            visualizations: [
                {
                    id: 'viz-intersection-surface',
                    title: 'Intersection of Curves on a Surface',
                    description: 'Two curves on a surface meet at intersection points. Drag to rotate the view and see the intersection number C.D computed as the count of intersection points.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 1
                        });
                        var ctx = viz.ctx;
                        var time = 0;
                        var degC = 2, degD = 2;

                        VizEngine.createSlider(controls, 'deg(C)', 1, 4, degC, 1, function(v) { degC = Math.round(v); });
                        VizEngine.createSlider(controls, 'deg(D)', 1, 4, degD, 1, function(v) { degD = Math.round(v); });

                        function project3D(x, y, z, angle) {
                            var ca = Math.cos(angle), sa = Math.sin(angle);
                            var rx = x * ca - z * sa;
                            var rz = x * sa + z * ca;
                            var scale = 150 / (4 + rz * 0.3);
                            return { sx: 280 + rx * scale, sy: 180 - y * scale + rz * 8, depth: rz };
                        }

                        function draw(t) {
                            time = t * 0.001;
                            viz.clear();
                            var angle = time * 0.3;

                            // Draw surface as a grid (plane for P^2 intuition)
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var i = -5; i <= 5; i++) {
                                ctx.beginPath();
                                var moved = false;
                                for (var j = -5; j <= 5; j++) {
                                    var p = project3D(i * 0.4, 0, j * 0.4, angle);
                                    if (!moved) { ctx.moveTo(p.sx, p.sy); moved = true; }
                                    else ctx.lineTo(p.sx, p.sy);
                                }
                                ctx.stroke();
                                ctx.beginPath();
                                moved = false;
                                for (var j2 = -5; j2 <= 5; j2++) {
                                    var p2 = project3D(j2 * 0.4, 0, i * 0.4, angle);
                                    if (!moved) { ctx.moveTo(p2.sx, p2.sy); moved = true; }
                                    else ctx.lineTo(p2.sx, p2.sy);
                                }
                                ctx.stroke();
                            }

                            // Curve C: polynomial curve on the surface
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var first = true;
                            for (var s = -50; s <= 50; s++) {
                                var tt = s / 25;
                                var cx3d, cy3d, cz3d;
                                if (degC === 1) { cx3d = tt; cy3d = 0; cz3d = 0.5 * tt + 0.3; }
                                else if (degC === 2) { cx3d = tt; cy3d = 0; cz3d = 0.3 * tt * tt - 0.5; }
                                else if (degC === 3) { cx3d = tt; cy3d = 0; cz3d = 0.15 * tt * tt * tt - 0.3 * tt; }
                                else { cx3d = tt; cy3d = 0; cz3d = 0.08 * tt * tt * tt * tt - 0.3 * tt * tt + 0.2; }
                                if (Math.abs(cx3d) > 2 || Math.abs(cz3d) > 2) { first = true; continue; }
                                var pc = project3D(cx3d, cy3d, cz3d, angle);
                                if (first) { ctx.moveTo(pc.sx, pc.sy); first = false; }
                                else ctx.lineTo(pc.sx, pc.sy);
                            }
                            ctx.stroke();

                            // Curve D: another curve
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            first = true;
                            for (var s2 = -50; s2 <= 50; s2++) {
                                var tt2 = s2 / 25;
                                var dx3d, dy3d, dz3d;
                                if (degD === 1) { dx3d = -0.3 + 0.5 * tt2; dy3d = 0; dz3d = tt2; }
                                else if (degD === 2) { dx3d = 0.3 * tt2 * tt2 - 0.4; dy3d = 0; dz3d = tt2; }
                                else if (degD === 3) { dx3d = 0.15 * tt2 * tt2 * tt2 + 0.2 * tt2; dy3d = 0; dz3d = tt2; }
                                else { dx3d = 0.08 * tt2 * tt2 * tt2 * tt2 - 0.2 * tt2 * tt2 + 0.1; dy3d = 0; dz3d = tt2; }
                                if (Math.abs(dx3d) > 2 || Math.abs(dz3d) > 2) { first = true; continue; }
                                var pd = project3D(dx3d, dy3d, dz3d, angle);
                                if (first) { ctx.moveTo(pd.sx, pd.sy); first = false; }
                                else ctx.lineTo(pd.sx, pd.sy);
                            }
                            ctx.stroke();

                            // Find approximate intersections
                            var intersections = [];
                            for (var s3 = -50; s3 <= 50; s3++) {
                                var tc = s3 / 25;
                                var cxv, czv;
                                if (degC === 1) { cxv = tc; czv = 0.5 * tc + 0.3; }
                                else if (degC === 2) { cxv = tc; czv = 0.3 * tc * tc - 0.5; }
                                else if (degC === 3) { cxv = tc; czv = 0.15 * tc * tc * tc - 0.3 * tc; }
                                else { cxv = tc; czv = 0.08 * tc * tc * tc * tc - 0.3 * tc * tc + 0.2; }

                                for (var s4 = -50; s4 <= 50; s4++) {
                                    var td = s4 / 25;
                                    var dxv, dzv;
                                    if (degD === 1) { dxv = -0.3 + 0.5 * td; dzv = td; }
                                    else if (degD === 2) { dxv = 0.3 * td * td - 0.4; dzv = td; }
                                    else if (degD === 3) { dxv = 0.15 * td * td * td + 0.2 * td; dzv = td; }
                                    else { dxv = 0.08 * td * td * td * td - 0.2 * td * td + 0.1; dzv = td; }

                                    var dist = Math.sqrt((cxv - dxv) * (cxv - dxv) + (czv - dzv) * (czv - dzv));
                                    if (dist < 0.06) {
                                        var tooClose = false;
                                        for (var k = 0; k < intersections.length; k++) {
                                            if (Math.sqrt((intersections[k].x - cxv) * (intersections[k].x - cxv) + (intersections[k].z - czv) * (intersections[k].z - czv)) < 0.2) {
                                                tooClose = true; break;
                                            }
                                        }
                                        if (!tooClose) intersections.push({ x: (cxv + dxv) / 2, z: (czv + dzv) / 2 });
                                    }
                                }
                            }

                            // Draw intersection points
                            for (var ip = 0; ip < intersections.length; ip++) {
                                var pi2 = project3D(intersections[ip].x, 0, intersections[ip].z, angle);
                                var pulse = 5 + 2 * Math.sin(time * 3 + ip);
                                ctx.fillStyle = viz.colors.green + '44';
                                ctx.beginPath(); ctx.arc(pi2.sx, pi2.sy, pulse + 4, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(pi2.sx, pi2.sy, 5, 0, Math.PI * 2); ctx.fill();
                            }

                            // Labels
                            viz.screenText('Intersection of Curves on a Surface', 280, 20, viz.colors.white, 15);
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('C (deg ' + degC + ')', 20, 370);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('D (deg ' + degD + ')', 120, 370);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('C \u00B7 D = ' + intersections.length + ' intersection pts', 240, 370);

                            viz.screenText('Bezout: C \u00B7 D = deg(C) \u00D7 deg(D) = ' + (degC * degD), 280, 390, viz.colors.text, 11);
                        }

                        viz.animate(draw);
                        return viz;
                    }
                },
                {
                    id: 'viz-self-intersection',
                    title: 'Self-Intersection: Deforming a Curve',
                    description: 'Self-intersection C.C is computed by deforming C to a nearby curve C\' and counting intersections. Slide the deformation parameter to see how C\' moves and the self-intersection number emerges.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 190, scale: 60
                        });
                        var ctx = viz.ctx;
                        var epsilon = 0.5;
                        var curveType = 'line';

                        VizEngine.createSlider(controls, 'Deformation \u03B5', 0, 1, epsilon, 0.05, function(v) { epsilon = v; draw(); });

                        var sel = document.createElement('select');
                        sel.style.cssText = 'background:#161b22;color:#c9d1d9;border:1px solid #30363d;padding:4px 8px;border-radius:4px;font-size:13px;';
                        [{v:'line',l:'Line in P\u00B2 (L\u00B2=1)'},{v:'conic',l:'Conic in P\u00B2 (C\u00B2=4)'},{v:'fiber',l:'Fiber on P\u00B9\u00D7P\u00B9 (F\u00B2=0)'}].forEach(function(o) {
                            var opt = document.createElement('option'); opt.value = o.v; opt.textContent = o.l; sel.appendChild(opt);
                        });
                        sel.addEventListener('change', function() { curveType = sel.value; draw(); });
                        controls.appendChild(sel);

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            if (curveType === 'line') {
                                // Line L: y = 0.5x, deformed L': y = 0.5x + epsilon
                                viz.drawFunction(function(x) { return 0.5 * x; }, -5, 5, viz.colors.blue, 2.5);
                                viz.drawFunction(function(x) { return 0.5 * x + epsilon; }, -5, 5, viz.colors.teal, 2, 200);

                                if (epsilon > 0.01) {
                                    // Intersection: 0.5x = 0.5x + eps => no intersection in affine chart
                                    // But in P^2, parallel lines meet at infinity: 1 point
                                    viz.screenText('In P\u00B2: L and L\' meet at 1 point at infinity', 280, 350, viz.colors.green, 12);
                                    viz.screenText('L\u00B2 = 1', 280, 370, viz.colors.white, 14);
                                    // Draw arrow to infinity
                                    ctx.strokeStyle = viz.colors.green + '88';
                                    ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                                    var sx1 = viz.toScreen(4, 2)[0], sy1 = viz.toScreen(4, 2)[1];
                                    var sx2 = viz.toScreen(4.5, 2 + epsilon)[0], sy2 = viz.toScreen(4.5, 2 + epsilon + 0.25)[1];
                                    ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
                                    ctx.setLineDash([]);
                                } else {
                                    viz.screenText('L = L\': deform to compute L\u00B2', 280, 360, viz.colors.text, 12);
                                }

                                viz.drawText('L', -3.5, -1.75 + 0.3, viz.colors.blue, 14);
                                viz.drawText("L'", -3.5, -1.75 + epsilon + 0.3, viz.colors.teal, 14);

                            } else if (curveType === 'conic') {
                                // Conic: x^2 + y^2 = 4, deformed: (x - eps)^2 + y^2 = 4
                                viz.drawFunction(function(x) { return Math.sqrt(Math.max(0, 4 - x * x)); }, -2, 2, viz.colors.blue, 2.5);
                                viz.drawFunction(function(x) { return -Math.sqrt(Math.max(0, 4 - x * x)); }, -2, 2, viz.colors.blue, 2.5);

                                var shift = epsilon * 0.8;
                                viz.drawFunction(function(x) { return Math.sqrt(Math.max(0, 4 - (x - shift) * (x - shift))); }, -2 + shift, 2 + shift, viz.colors.teal, 2);
                                viz.drawFunction(function(x) { return -Math.sqrt(Math.max(0, 4 - (x - shift) * (x - shift))); }, -2 + shift, 2 + shift, viz.colors.teal, 2);

                                // Find intersections of two circles
                                if (shift > 0.05) {
                                    var d = shift;
                                    if (d < 4) {
                                        var ix = d / 2;
                                        var iyy = 4 - ix * ix;
                                        if (iyy > 0) {
                                            var iy = Math.sqrt(iyy);
                                            viz.drawPoint(ix, iy, viz.colors.green, null, 6);
                                            viz.drawPoint(ix, -iy, viz.colors.green, null, 6);
                                        }
                                    }
                                    viz.screenText('Visible: 2 affine intersections; 2 more at infinity', 280, 350, viz.colors.green, 11);
                                }
                                viz.screenText('C\u00B2 = deg\u00B2 = 4 (Bezout)', 280, 370, viz.colors.white, 14);
                                viz.drawText('C', 1.5, 1.5, viz.colors.blue, 14);
                                viz.drawText("C'", 1.5 + shift, 1.5, viz.colors.teal, 14);

                            } else {
                                // Fiber on P^1 x P^1: vertical line x = 0, deformed to x = epsilon
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2.5;
                                var sx0 = viz.toScreen(0, 0)[0];
                                ctx.beginPath(); ctx.moveTo(sx0, 0); ctx.lineTo(sx0, viz.height); ctx.stroke();

                                ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                                var sx1b = viz.toScreen(epsilon * 2, 0)[0];
                                ctx.beginPath(); ctx.moveTo(sx1b, 0); ctx.lineTo(sx1b, viz.height); ctx.stroke();

                                viz.screenText('Fibers are disjoint: F \u00B7 F\' = 0 for all \u03B5 > 0', 280, 350, viz.colors.green, 12);
                                viz.screenText('F\u00B2 = 0', 280, 370, viz.colors.white, 14);
                                viz.drawText('F', -0.3, 2.5, viz.colors.blue, 14);
                                viz.drawText("F'", epsilon * 2 + 0.3, 2.5, viz.colors.teal, 14);
                            }

                            viz.screenText('Self-Intersection via Deformation', 280, 15, viz.colors.white, 15);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'On \\(\\mathbb{P}^2\\), let \\(C\\) be a smooth curve of degree 3 (a cubic) and \\(D\\) a smooth curve of degree 2 (a conic). Compute \\(C \\cdot D\\) and \\(C^2\\).',
                    hint: 'Use Bezout\'s theorem: for curves of degree \\(d\\) and \\(e\\) in \\(\\mathbb{P}^2\\), \\(C \\cdot D = de\\).',
                    solution: 'By Bezout, \\(C \\cdot D = 3 \\times 2 = 6\\). For self-intersection, \\(C^2 = 3^2 = 9\\).'
                },
                {
                    question: 'Use the adjunction formula to compute the genus of a smooth quartic curve (degree 4) in \\(\\mathbb{P}^2\\).',
                    hint: 'Recall \\(K_{\\mathbb{P}^2} = -3H\\). Apply \\(2g - 2 = C^2 + K \\cdot C\\) with \\(C = 4H\\).',
                    solution: '\\(C^2 = 16\\), \\(K \\cdot C = (-3)(4) = -12\\). So \\(2g - 2 = 16 - 12 = 4\\), giving \\(g = 3\\). This matches \\(\\frac{(4-1)(4-2)}{2} = 3\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Blowing Up Surfaces
        // ================================================================
        {
            id: 'sec-blowup-surface',
            title: 'Blowing Up Surfaces',
            content: `
<div class="bridge section-roadmap">
    <p><strong>Section goal:</strong> Define the blowup of a surface at a point, show that the exceptional divisor has self-intersection \\(-1\\), and explain how blowups modify intersection numbers.</p>
</div>

<h2>Blowup of a Surface at a Point</h2>

<div class="env-block intuition">
    <div class="env-title">Separating Tangent Directions</div>
    <div class="env-body">
        <p>Recall from Chapter 8 that blowing up a point \\(p\\) on a surface \\(S\\) replaces \\(p\\) by a copy of \\(\\mathbb{P}^1\\), the "exceptional curve" \\(E\\). Each point of \\(E\\) corresponds to a tangent direction at \\(p\\). Two curves through \\(p\\) with different tangent directions become disjoint after the blowup, because they hit \\(E\\) at different points.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Blowup at a Point)</div>
    <div class="env-body">
        <p>Let \\(S\\) be a smooth surface and \\(p \\in S\\). The <strong>blowup</strong> \\(\\pi: \\tilde{S} \\to S\\) at \\(p\\) is the unique (up to isomorphism) morphism such that:</p>
        <ol>
            <li>\\(\\pi\\) is an isomorphism away from \\(p\\): \\(\\pi^{-1}(S \\setminus \\{p\\}) \\cong S \\setminus \\{p\\}\\).</li>
            <li>\\(E = \\pi^{-1}(p) \\cong \\mathbb{P}^1\\) is the <strong>exceptional curve</strong>.</li>
        </ol>
        <p>In local coordinates \\((x, y)\\) at \\(p\\), \\(\\tilde{S}\\) is the closure in \\(S \\times \\mathbb{P}^1\\) of the graph \\(\\{(x, y, [x:y]) : (x,y) \\neq (0,0)\\}\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.3 (Properties of Blowup)</div>
    <div class="env-body">
        <p>Let \\(\\pi: \\tilde{S} \\to S\\) be the blowup at \\(p\\) with exceptional curve \\(E\\). Then:</p>
        <ol>
            <li>\\(E \\cong \\mathbb{P}^1\\) and \\(E^2 = -1\\).</li>
            <li>If \\(C \\subset S\\) is a curve through \\(p\\) with multiplicity \\(m\\), its <strong>strict transform</strong> \\(\\tilde{C}\\) satisfies \\(\\pi^* C = \\tilde{C} + mE\\).</li>
            <li>\\(\\tilde{C}^2 = C^2 - m^2\\).</li>
            <li>\\(K_{\\tilde{S}} = \\pi^* K_S + E\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of \\(E^2 = -1\\)</div>
    <div class="env-body">
        <p>Take a line \\(L\\) through \\(p\\) in \\(S\\). Its total transform is \\(\\pi^* L = \\tilde{L} + E\\). Since \\(\\tilde{L}\\) is the strict transform and \\(L\\) passed through \\(p\\) with multiplicity 1, we have:</p>
        \\[0 = \\pi^* L \\cdot E = (\\tilde{L} + E) \\cdot E = \\tilde{L} \\cdot E + E^2.\\]
        <p>Now \\(\\tilde{L} \\cdot E = 1\\) (the strict transform of \\(L\\) meets \\(E\\) transversally at the point corresponding to the tangent direction of \\(L\\) at \\(p\\)). So \\(E^2 = -1\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Blowup of \\(\\mathbb{P}^2\\) at a Point</div>
    <div class="env-body">
        <p>Let \\(\\tilde{S} = \\text{Bl}_p \\mathbb{P}^2\\). This is the first Hirzebruch surface \\(\\mathbb{F}_1\\). The Picard group is \\(\\operatorname{Pic}(\\tilde{S}) = \\mathbb{Z}H \\oplus \\mathbb{Z}E\\), where \\(H\\) is the pullback of a line and \\(E\\) is the exceptional curve. The intersection form is:</p>
        \\[H^2 = 1, \\quad E^2 = -1, \\quad H \\cdot E = 0.\\]
        <p>The strict transform of a line through \\(p\\) is \\(\\tilde{L} = H - E\\), and \\(\\tilde{L}^2 = 1 - 1 = 0\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Castelnuovo's Contraction Criterion</div>
    <div class="env-body">
        <p>The reverse of blowing up is <strong>blowing down</strong> (or contracting). Castelnuovo proved: a smooth rational curve \\(E\\) on a smooth surface \\(S\\) with \\(E^2 = -1\\) can be blown down to a smooth point. Such curves are called <strong>\\((-1)\\)-curves</strong> or <strong>exceptional curves of the first kind</strong>.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-surface-blowup"></div>
`,
            visualizations: [
                {
                    id: 'viz-surface-blowup',
                    title: 'Blowup of P\u00B2 at a Point',
                    description: 'Watch the blowup replace a point with an exceptional curve E. Two curves through p are separated after blowup, meeting E at different points. Animated transition from S to the blowup.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 1
                        });
                        var ctx = viz.ctx;
                        var blowupT = 0;
                        var animating = true;

                        var slider = VizEngine.createSlider(controls, 'Blowup t', 0, 1, 0, 0.01, function(v) {
                            blowupT = v; animating = false;
                        });

                        VizEngine.createButton(controls, 'Animate', function() { animating = true; blowupT = 0; });

                        function draw(t) {
                            if (animating) {
                                blowupT = (Math.sin(t * 0.001 * 0.8) + 1) / 2;
                                slider.value = blowupT;
                                slider.dispatchEvent(new Event('input'));
                            }
                            viz.clear();

                            var cx = 280, cy = 200;
                            var bt = blowupT;

                            // Title
                            viz.screenText(bt < 0.1 ? 'Surface S with point p' : bt > 0.9 ? 'Blowup \u0168 with exceptional curve E' : 'Blowing up...', cx, 20, viz.colors.white, 15);

                            // Draw the surface (two halves that separate)
                            var gap = bt * 40;
                            ctx.fillStyle = '#1a2040';
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;

                            // Left half of surface
                            ctx.beginPath();
                            ctx.moveTo(40, cy - 80);
                            ctx.lineTo(cx - gap / 2, cy - 80);
                            ctx.quadraticCurveTo(cx - gap / 2 + 10, cy, cx - gap / 2, cy + 80);
                            ctx.lineTo(40, cy + 80);
                            ctx.closePath();
                            ctx.fill(); ctx.stroke();

                            // Right half
                            ctx.beginPath();
                            ctx.moveTo(520, cy - 80);
                            ctx.lineTo(cx + gap / 2, cy - 80);
                            ctx.quadraticCurveTo(cx + gap / 2 - 10, cy, cx + gap / 2, cy + 80);
                            ctx.lineTo(520, cy + 80);
                            ctx.closePath();
                            ctx.fill(); ctx.stroke();

                            // Exceptional curve E (appears during blowup)
                            if (bt > 0.05) {
                                var eAlpha = Math.min(1, bt * 2);
                                ctx.strokeStyle = 'rgba(248, 81, 73, ' + eAlpha + ')';
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(cx - gap / 2, cy - 70 * bt);
                                ctx.lineTo(cx - gap / 2, cy + 70 * bt);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(cx + gap / 2, cy - 70 * bt);
                                ctx.lineTo(cx + gap / 2, cy + 70 * bt);
                                ctx.stroke();

                                // Fill the exceptional region
                                ctx.fillStyle = 'rgba(248, 81, 73, ' + (0.15 * eAlpha) + ')';
                                ctx.fillRect(cx - gap / 2, cy - 70 * bt, gap, 140 * bt);

                                if (bt > 0.3) {
                                    viz.screenText('E', cx, cy - 70 * bt - 12, viz.colors.red, 14);
                                    viz.screenText('E\u00B2 = -1', cx, cy + 70 * bt + 16, viz.colors.red, 12);
                                }
                            }

                            // Point p (shrinks during blowup)
                            if (bt < 0.9) {
                                var pSize = 6 * (1 - bt);
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(cx, cy, pSize, 0, Math.PI * 2); ctx.fill();
                                if (bt < 0.3) viz.screenText('p', cx + 12, cy - 8, viz.colors.green, 13);
                            }

                            // Curve 1 through p (line with slope +1)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(40, cy + (cx - 40) * 0.4);
                            if (bt < 0.1) {
                                ctx.lineTo(520, cy - (520 - cx) * 0.4);
                            } else {
                                ctx.lineTo(cx - gap / 2, cy + gap / 2 * 0.4);
                                ctx.moveTo(cx + gap / 2, cy - gap / 2 * 0.4);
                                ctx.lineTo(520, cy - (520 - cx) * 0.4);
                            }
                            ctx.stroke();

                            // Curve 2 through p (line with slope -1)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(40, cy - (cx - 40) * 0.4);
                            if (bt < 0.1) {
                                ctx.lineTo(520, cy + (520 - cx) * 0.4);
                            } else {
                                ctx.lineTo(cx - gap / 2, cy - gap / 2 * 0.4);
                                ctx.moveTo(cx + gap / 2, cy + gap / 2 * 0.4);
                                ctx.lineTo(520, cy + (520 - cx) * 0.4);
                            }
                            ctx.stroke();

                            // Intersection points on E
                            if (bt > 0.2) {
                                var eA = Math.min(1, (bt - 0.2) * 2.5);
                                ctx.fillStyle = 'rgba(88, 166, 255, ' + eA + ')';
                                ctx.beginPath();
                                var ey1 = cy + gap / 2 * 0.4;
                                ctx.arc(cx - gap / 2 * 0.5, cy - gap / 2 * 0.4 * 0.5 + (cy + gap / 2 * 0.4 - cy + gap / 2 * 0.4) * 0.5, 4, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = 'rgba(240, 136, 62, ' + eA + ')';
                                ctx.beginPath();
                                ctx.arc(cx + gap / 2 * 0.5, cy + gap / 2 * 0.4 * 0.5, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Labels
                            viz.screenText('C\u2081', 80, cy + (cx - 80) * 0.4 - 12, viz.colors.blue, 12);
                            viz.screenText('C\u2082', 80, cy - (cx - 80) * 0.4 + 14, viz.colors.orange, 12);

                            if (bt > 0.5) {
                                viz.screenText('C\u2081 and C\u2082 separated: meet E at different points', cx, 375, viz.colors.text, 11);
                            } else if (bt < 0.1) {
                                viz.screenText('C\u2081 and C\u2082 both pass through p', cx, 375, viz.colors.text, 11);
                            }
                        }

                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(\\tilde{S} = \\text{Bl}_p \\mathbb{P}^2\\) and let \\(C\\) be a conic through \\(p\\). What is the self-intersection of the strict transform \\(\\tilde{C}\\) in \\(\\tilde{S}\\)?',
                    hint: 'A conic has degree 2, so \\(C^2 = 4\\) in \\(\\mathbb{P}^2\\). Through \\(p\\) with multiplicity 1, so \\(\\tilde{C}^2 = C^2 - 1^2\\).',
                    solution: '\\(\\tilde{C}^2 = 4 - 1 = 3\\).'
                },
                {
                    question: 'Blow up \\(\\mathbb{P}^2\\) at two points \\(p, q\\). Let \\(L\\) be the line through \\(p\\) and \\(q\\). What is the self-intersection of the strict transform \\(\\tilde{L}\\)?',
                    hint: 'Each blowup reduces the self-intersection by the square of the multiplicity of passage through the center.',
                    solution: '\\(L^2 = 1\\) in \\(\\mathbb{P}^2\\). The line passes through both \\(p\\) and \\(q\\) with multiplicity 1. After blowing up both points: \\(\\tilde{L}^2 = 1 - 1 - 1 = -1\\). So \\(\\tilde{L}\\) becomes a \\((-1)\\)-curve!'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Classification of Surfaces
        // ================================================================
        {
            id: 'sec-classification',
            title: 'Classification of Surfaces',
            content: `
<div class="bridge section-roadmap">
    <p><strong>Section goal:</strong> Present the Enriques-Kodaira classification of algebraic surfaces by Kodaira dimension, with examples for each class.</p>
</div>

<h2>The Enriques-Kodaira Classification</h2>

<div class="env-block intuition">
    <div class="env-title">Classifying Surfaces by Their Canonical Class</div>
    <div class="env-body">
        <p>For curves, the genus (equivalently, the degree of \\(K_C\\)) determines the geometry: genus 0 is rational (\\(\\mathbb{P}^1\\)), genus 1 is elliptic, genus \\(\\geq 2\\) is "general type." For surfaces, the analogue of genus is the <strong>Kodaira dimension</strong> \\(\\kappa(S)\\), which measures the growth rate of pluricanonical sections \\(H^0(S, K_S^{\\otimes n})\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Kodaira Dimension)</div>
    <div class="env-body">
        <p>The <strong>Kodaira dimension</strong> \\(\\kappa(S)\\) of a smooth projective surface \\(S\\) is:</p>
        <ul>
            <li>\\(\\kappa(S) = -\\infty\\) if \\(H^0(S, K_S^{\\otimes n}) = 0\\) for all \\(n \\geq 1\\).</li>
            <li>\\(\\kappa(S) = 0\\) if \\(\\dim H^0(S, K_S^{\\otimes n})\\) is bounded but not identically 0.</li>
            <li>\\(\\kappa(S) = 1\\) if \\(\\dim H^0(S, K_S^{\\otimes n})\\) grows linearly in \\(n\\).</li>
            <li>\\(\\kappa(S) = 2\\) if \\(\\dim H^0(S, K_S^{\\otimes n})\\) grows quadratically in \\(n\\).</li>
        </ul>
        <p>Equivalently, \\(\\kappa(S)\\) is the dimension of the image of \\(S\\) under the pluricanonical map \\(\\varphi_{|nK_S|}\\) for sufficiently large \\(n\\) (or \\(-\\infty\\) if the map is undefined for all \\(n\\)).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.4 (Enriques-Kodaira Classification)</div>
    <div class="env-body">
        <p>Every smooth projective surface over \\(\\mathbb{C}\\) is birational to exactly one of the following types (after passing to the minimal model):</p>
        <table style="width:100%; border-collapse:collapse; margin:10px 0;">
            <tr style="border-bottom:2px solid #30363d;">
                <th style="padding:6px; text-align:left;">\\(\\kappa\\)</th>
                <th style="padding:6px; text-align:left;">Type</th>
                <th style="padding:6px; text-align:left;">Examples</th>
            </tr>
            <tr style="border-bottom:1px solid #21262d;">
                <td style="padding:6px;">\\(-\\infty\\)</td>
                <td style="padding:6px;">Rational or Ruled</td>
                <td style="padding:6px;">\\(\\mathbb{P}^2\\), \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\), Hirzebruch surfaces \\(\\mathbb{F}_n\\)</td>
            </tr>
            <tr style="border-bottom:1px solid #21262d;">
                <td style="padding:6px;">0</td>
                <td style="padding:6px;">K3, Abelian, Enriques, hyperelliptic</td>
                <td style="padding:6px;">Quartic in \\(\\mathbb{P}^3\\), complex torus, Kummer surface</td>
            </tr>
            <tr style="border-bottom:1px solid #21262d;">
                <td style="padding:6px;">1</td>
                <td style="padding:6px;">Elliptic surfaces</td>
                <td style="padding:6px;">Fibrations \\(S \\to C\\) with generic fiber an elliptic curve</td>
            </tr>
            <tr>
                <td style="padding:6px;">2</td>
                <td style="padding:6px;">General type</td>
                <td style="padding:6px;">Degree \\(\\geq 5\\) surfaces in \\(\\mathbb{P}^3\\), products of curves of genus \\(\\geq 2\\)</td>
            </tr>
        </table>
    </div>
</div>

<h3>\\(\\kappa = -\\infty\\): Rational and Ruled Surfaces</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>A surface \\(S\\) is <strong>rational</strong> if it is birational to \\(\\mathbb{P}^2\\), and <strong>ruled</strong> if it admits a fibration \\(\\pi: S \\to C\\) with fibers \\(\\cong \\mathbb{P}^1\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.5 (Castelnuovo's Rationality Criterion)</div>
    <div class="env-body">
        <p>A smooth projective surface \\(S\\) over \\(\\mathbb{C}\\) is rational if and only if \\(q(S) = h^1(\\mathcal{O}_S) = 0\\) and \\(P_2(S) = h^0(K_S^{\\otimes 2}) = 0\\).</p>
    </div>
</div>

<h3>\\(\\kappa = 0\\): K3 and Abelian Surfaces</h3>

<div class="env-block definition">
    <div class="env-title">Definition (K3 Surface)</div>
    <div class="env-body">
        <p>A <strong>K3 surface</strong> is a smooth projective surface \\(S\\) with \\(K_S \\sim 0\\) and \\(H^1(S, \\mathcal{O}_S) = 0\\). The name honors Kummer, Kahler, and Kodaira (and the mountain K2).</p>
        <p>Key invariants: \\(\\chi(\\mathcal{O}_S) = 2\\), \\(h^{1,1} = 20\\), \\(b_2 = 22\\). The intersection form on \\(H^2(S, \\mathbb{Z})\\) is the unique even unimodular lattice of signature \\((3, 19)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Quartic in \\(\\mathbb{P}^3\\)</div>
    <div class="env-body">
        <p>A smooth quartic surface \\(S \\subset \\mathbb{P}^3\\) (degree 4) is a K3 surface. By adjunction, \\(K_S = (K_{\\mathbb{P}^3} + S)|_S = (-4H + 4H)|_S = 0\\).</p>
    </div>
</div>

<h3>\\(\\kappa = 2\\): Surfaces of General Type</h3>

<div class="env-block remark">
    <div class="env-title">Remark</div>
    <div class="env-body">
        <p>Surfaces of general type are the "generic" case. They satisfy the <strong>Bogomolov-Miyaoka-Yau inequality</strong> \\(K_S^2 \\leq 3 c_2(S)\\) and the <strong>Noether inequality</strong> \\(K_S^2 \\geq 2\\chi(\\mathcal{O}_S) - 6\\). The "geography" of surfaces of general type (which pairs \\((K^2, \\chi)\\) are realized) is a rich subject.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-surface-gallery"></div>
<div class="viz-placeholder" data-viz="viz-kodaira-dimension"></div>
`,
            visualizations: [
                {
                    id: 'viz-surface-gallery',
                    title: 'Gallery of Algebraic Surfaces',
                    description: 'Explore the main types of algebraic surfaces: rational (P\u00B2), ruled (P\u00B9\u00D7P\u00B9), K3, abelian, and general type. Click to see each type with its key invariants.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 210, scale: 1
                        });
                        var ctx = viz.ctx;
                        var selected = 0;

                        var surfaces = [
                            { name: 'P\u00B2 (Rational)', kappa: '-\u221E', K2: 9, chi: 1, q: 0,
                              desc: 'The projective plane. Simplest surface. Every line meets every other line.', color: '#58a6ff' },
                            { name: 'P\u00B9\u00D7P\u00B9 (Ruled)', kappa: '-\u221E', K2: 8, chi: 1, q: 0,
                              desc: 'Quadric surface. Two families of lines (rulings). Intersection form (0,1;1,0).', color: '#3fb9a0' },
                            { name: 'K3 Surface', kappa: '0', K2: 0, chi: 2, q: 0,
                              desc: 'K\u22610, h\u00B9\u00B9=20. Rich lattice theory. Quartic in P\u00B3 is an example.', color: '#bc8cff' },
                            { name: 'Abelian Surface', kappa: '0', K2: 0, chi: 0, q: 2,
                              desc: '2-dim abelian variety. Group structure. K\u22610, q=2.', color: '#f0883e' },
                            { name: 'General Type', kappa: '2', K2: '5+', chi: '1+', q: '0+',
                              desc: 'Generic surfaces. Degree \u22655 in P\u00B3. Satisfy BMY and Noether inequalities.', color: '#f85149' }
                        ];

                        // Buttons
                        surfaces.forEach(function(s, i) {
                            VizEngine.createButton(controls, s.name, function() { selected = i; draw(); });
                        });

                        function drawSurfaceShape(idx) {
                            var cx = 280, cy = 200;
                            ctx.save();

                            if (idx === 0) {
                                // P^2: triangle-like region
                                ctx.strokeStyle = surfaces[0].color;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(cx - 100, cy + 80);
                                ctx.lineTo(cx + 100, cy + 80);
                                ctx.lineTo(cx, cy - 100);
                                ctx.closePath();
                                ctx.stroke();
                                ctx.fillStyle = surfaces[0].color + '22';
                                ctx.fill();
                                // Lines
                                for (var i = 0; i < 4; i++) {
                                    var a = Math.PI * 2 * i / 4 + 0.3;
                                    ctx.strokeStyle = surfaces[0].color + '66';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(cx + Math.cos(a) * 120, cy + Math.sin(a) * 100);
                                    ctx.lineTo(cx - Math.cos(a) * 120, cy - Math.sin(a) * 100);
                                    ctx.stroke();
                                }
                            } else if (idx === 1) {
                                // P^1 x P^1: grid of rulings
                                ctx.strokeStyle = surfaces[1].color;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(cx - 100, cy - 80, 200, 160);
                                ctx.fillStyle = surfaces[1].color + '15';
                                ctx.fillRect(cx - 100, cy - 80, 200, 160);
                                for (var j = 1; j < 5; j++) {
                                    ctx.strokeStyle = surfaces[1].color + '44';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(cx - 100 + j * 40, cy - 80);
                                    ctx.lineTo(cx - 100 + j * 40, cy + 80);
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(cx - 100, cy - 80 + j * 32);
                                    ctx.lineTo(cx + 100, cy - 80 + j * 32);
                                    ctx.stroke();
                                }
                            } else if (idx === 2) {
                                // K3: smooth rounded shape
                                ctx.strokeStyle = surfaces[2].color;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                for (var k = 0; k <= 100; k++) {
                                    var theta = k / 100 * Math.PI * 2;
                                    var rr = 90 + 15 * Math.sin(3 * theta) + 8 * Math.cos(5 * theta);
                                    var px = cx + rr * Math.cos(theta);
                                    var py = cy + rr * 0.8 * Math.sin(theta);
                                    if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.closePath();
                                ctx.stroke();
                                ctx.fillStyle = surfaces[2].color + '18';
                                ctx.fill();
                                // Lattice points
                                for (var lx = -2; lx <= 2; lx++) {
                                    for (var ly = -2; ly <= 2; ly++) {
                                        if (lx * lx + ly * ly > 5) continue;
                                        ctx.fillStyle = surfaces[2].color + '55';
                                        ctx.beginPath(); ctx.arc(cx + lx * 30, cy + ly * 25, 3, 0, Math.PI * 2); ctx.fill();
                                    }
                                }
                            } else if (idx === 3) {
                                // Abelian: torus shape (parallelogram with identified sides)
                                var w = 180, h = 140;
                                var skew = 30;
                                ctx.strokeStyle = surfaces[3].color;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(cx - w/2, cy + h/2);
                                ctx.lineTo(cx + w/2, cy + h/2);
                                ctx.lineTo(cx + w/2 + skew, cy - h/2);
                                ctx.lineTo(cx - w/2 + skew, cy - h/2);
                                ctx.closePath();
                                ctx.stroke();
                                ctx.fillStyle = surfaces[3].color + '18';
                                ctx.fill();
                                // Identification arrows
                                ctx.strokeStyle = surfaces[3].color + '88';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([6, 3]);
                                // Top-bottom
                                ctx.beginPath();
                                ctx.moveTo(cx - 10, cy + h/2 + 8);
                                ctx.lineTo(cx - 10 + skew, cy - h/2 - 8);
                                ctx.stroke();
                                // Left-right
                                ctx.beginPath();
                                ctx.moveTo(cx - w/2 - 8, cy);
                                ctx.lineTo(cx + w/2 + 8, cy);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('\u2243 T\u00B2 \u00D7 T\u00B2', cx, cy, surfaces[3].color, 14);
                            } else {
                                // General type: complex shape
                                ctx.strokeStyle = surfaces[4].color;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var m = 0; m <= 200; m++) {
                                    var th = m / 200 * Math.PI * 2;
                                    var rg = 80 + 20 * Math.sin(2 * th) * Math.cos(3 * th) + 10 * Math.sin(7 * th);
                                    var pgx = cx + rg * Math.cos(th);
                                    var pgy = cy + rg * 0.85 * Math.sin(th);
                                    if (m === 0) ctx.moveTo(pgx, pgy); else ctx.lineTo(pgx, pgy);
                                }
                                ctx.closePath();
                                ctx.stroke();
                                ctx.fillStyle = surfaces[4].color + '15';
                                ctx.fill();
                                // Irregular curves inside
                                ctx.strokeStyle = surfaces[4].color + '44';
                                ctx.lineWidth = 1;
                                for (var ci = 0; ci < 5; ci++) {
                                    ctx.beginPath();
                                    for (var cj = 0; cj <= 30; cj++) {
                                        var ct = cj / 30;
                                        var ccx = cx - 60 + 120 * ct;
                                        var ccy = cy - 30 + 60 * Math.sin(ct * Math.PI + ci * 0.7) * (0.5 + 0.3 * ci);
                                        if (cj === 0) ctx.moveTo(ccx, ccy); else ctx.lineTo(ccx, ccy);
                                    }
                                    ctx.stroke();
                                }
                            }
                            ctx.restore();
                        }

                        function draw() {
                            viz.clear();
                            var s = surfaces[selected];

                            viz.screenText('Gallery of Algebraic Surfaces', 280, 18, viz.colors.white, 16);

                            drawSurfaceShape(selected);

                            // Info panel
                            var infoY = 330;
                            viz.screenText(s.name, 280, infoY, s.color, 16);
                            viz.screenText('\u03BA = ' + s.kappa + '    K\u00B2 = ' + s.K2 + '    \u03C7 = ' + s.chi + '    q = ' + s.q, 280, infoY + 22, viz.colors.text, 12);
                            viz.screenText(s.desc, 280, infoY + 44, viz.colors.white, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-kodaira-dimension',
                    title: 'Kodaira Dimension Flowchart',
                    description: 'A visual classification of surfaces by Kodaira dimension. Each value of kappa determines the qualitative geometry of the surface.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 210, scale: 1
                        });
                        var ctx = viz.ctx;

                        function roundRect(x, y, w, h, r, fill, stroke) {
                            ctx.beginPath();
                            ctx.moveTo(x + r, y);
                            ctx.lineTo(x + w - r, y);
                            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                            ctx.lineTo(x + w, y + h - r);
                            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                            ctx.lineTo(x + r, y + h);
                            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                            ctx.lineTo(x, y + r);
                            ctx.quadraticCurveTo(x, y, x + r, y);
                            ctx.closePath();
                            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
                        }

                        function arrow(x1, y1, x2, y2, color) {
                            ctx.strokeStyle = color; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                            var angle = Math.atan2(y2 - y1, x2 - x1);
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(x2, y2);
                            ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4));
                            ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4));
                            ctx.closePath(); ctx.fill();
                        }

                        function draw() {
                            viz.clear();

                            viz.screenText('Classification by Kodaira Dimension', 280, 18, viz.colors.white, 16);

                            // Top box: Surface S
                            roundRect(210, 35, 140, 32, 6, '#1a2040', viz.colors.white);
                            viz.screenText('Smooth surface S', 280, 51, viz.colors.white, 12);

                            // Arrows down to kappa values
                            var kappaY = 100;
                            var positions = [
                                { x: 70, label: '\u03BA = -\u221E', color: viz.colors.blue },
                                { x: 210, label: '\u03BA = 0', color: viz.colors.purple },
                                { x: 350, label: '\u03BA = 1', color: viz.colors.teal },
                                { x: 490, label: '\u03BA = 2', color: viz.colors.red }
                            ];

                            positions.forEach(function(p) {
                                arrow(280, 67, p.x, kappaY - 5, p.color + '88');
                                roundRect(p.x - 55, kappaY, 110, 28, 5, p.color + '33', p.color);
                                viz.screenText(p.label, p.x, kappaY + 14, p.color, 13);
                            });

                            // Sub-types
                            var subY = 155;

                            // kappa = -inf
                            roundRect(15, subY, 110, 24, 4, '#112244', viz.colors.blue + '88');
                            viz.screenText('Rational', 70, subY + 12, viz.colors.blue, 11);
                            roundRect(15, subY + 30, 110, 24, 4, '#112244', viz.colors.blue + '88');
                            viz.screenText('Ruled', 70, subY + 42, viz.colors.blue, 11);
                            arrow(70, kappaY + 28, 70, subY - 2, viz.colors.blue + '66');

                            // kappa = 0
                            var k0types = ['K3', 'Abelian', 'Enriques', 'Hyperelliptic'];
                            arrow(210, kappaY + 28, 210, subY - 2, viz.colors.purple + '66');
                            k0types.forEach(function(t, i) {
                                roundRect(155, subY + i * 26, 110, 22, 4, '#1a1240', viz.colors.purple + '88');
                                viz.screenText(t, 210, subY + i * 26 + 11, viz.colors.purple, 10);
                            });

                            // kappa = 1
                            arrow(350, kappaY + 28, 350, subY - 2, viz.colors.teal + '66');
                            roundRect(295, subY, 110, 24, 4, '#0a2020', viz.colors.teal + '88');
                            viz.screenText('Elliptic fibration', 350, subY + 12, viz.colors.teal, 10);
                            roundRect(295, subY + 30, 110, 24, 4, '#0a2020', viz.colors.teal + '88');
                            viz.screenText('S \u2192 C, fiber = ell. curve', 350, subY + 42, viz.colors.teal, 9);

                            // kappa = 2
                            arrow(490, kappaY + 28, 490, subY - 2, viz.colors.red + '66');
                            roundRect(435, subY, 110, 24, 4, '#200a0a', viz.colors.red + '88');
                            viz.screenText('General type', 490, subY + 12, viz.colors.red, 11);
                            roundRect(435, subY + 30, 110, 24, 4, '#200a0a', viz.colors.red + '88');
                            viz.screenText('deg \u2265 5 in P\u00B3', 490, subY + 42, viz.colors.red, 10);

                            // Growth rate annotation
                            var growY = 300;
                            viz.screenText('Growth of pluricanonical sections P_n = h\u2070(nK)', 280, growY, viz.colors.text, 12);

                            var growths = [
                                { x: 70, text: 'P_n = 0 for all n', color: viz.colors.blue },
                                { x: 210, text: 'P_n bounded', color: viz.colors.purple },
                                { x: 350, text: 'P_n ~ c\u00B7n', color: viz.colors.teal },
                                { x: 490, text: 'P_n ~ c\u00B7n\u00B2', color: viz.colors.red }
                            ];
                            growths.forEach(function(g) {
                                viz.screenText(g.text, g.x, growY + 20, g.color, 10);
                            });

                            // Analogy with curves
                            viz.screenText('Curve analogy: genus 0 | genus 1 | (n/a) | genus \u2265 2', 280, growY + 50, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the Kodaira dimension of a smooth quintic surface in \\(\\mathbb{P}^3\\)? Justify using the canonical class.',
                    hint: 'By adjunction, \\(K_S = (K_{\\mathbb{P}^3} + S)|_S = (d-4)H|_S\\). For \\(d = 5\\), \\(K_S = H|_S\\), which is ample.',
                    solution: '\\(K_S = H|_S\\) is ample (positive degree on every curve). Therefore \\(|nK_S|\\) grows as \\(n^2\\), giving \\(\\kappa(S) = 2\\). A quintic is of general type.'
                },
                {
                    question: 'Why is a smooth cubic surface in \\(\\mathbb{P}^3\\) rational? (Hint: 27 lines.)',
                    hint: 'Project from a line on the surface to \\(\\mathbb{P}^2\\).',
                    solution: 'A smooth cubic surface contains a line \\(\\ell\\). Projection from \\(\\ell\\) to \\(\\mathbb{P}^2\\) gives a birational map \\(S \\dashrightarrow \\mathbb{P}^2\\). Alternatively, by adjunction \\(K_S = (3-4)H|_S = -H|_S\\), so \\(K_S\\) is anti-ample, giving \\(\\kappa = -\\infty\\). By Castelnuovo\'s criterion, the cubic is rational.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Minimal Models
        // ================================================================
        {
            id: 'sec-minimal',
            title: 'Minimal Models',
            content: `
<div class="bridge section-roadmap">
    <p><strong>Section goal:</strong> Define minimal surfaces, explain the minimal model program for surfaces (contract \\((-1)\\)-curves), and preview how these ideas extend to higher dimensions.</p>
</div>

<h2>Minimal Models of Surfaces</h2>

<div class="env-block intuition">
    <div class="env-title">Removing Unnecessary Blowups</div>
    <div class="env-body">
        <p>Since we can blow up any point on any surface, there are infinitely many surfaces birational to a given one. A <strong>minimal model</strong> is the "simplest" representative of each birational class, obtained by contracting all \\((-1)\\)-curves. For surfaces, this process is straightforward. In higher dimensions, it becomes the subject of the celebrated <strong>Minimal Model Program (MMP)</strong>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Minimal Surface)</div>
    <div class="env-body">
        <p>A smooth projective surface \\(S\\) is <strong>minimal</strong> if it contains no \\((-1)\\)-curves, i.e., no smooth rational curve \\(E\\) with \\(E^2 = -1\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.6 (Existence of Minimal Models for Surfaces)</div>
    <div class="env-body">
        <p>Every smooth projective surface \\(S\\) admits a birational morphism \\(S \\to S_{\\min}\\) to a minimal surface, obtained by successively contracting \\((-1)\\)-curves. The process terminates because each contraction reduces \\(b_2(S)\\) by 1.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.7 (Uniqueness of Minimal Models)</div>
    <div class="env-body">
        <p>For surfaces with \\(\\kappa \\geq 0\\), the minimal model is unique (up to isomorphism). For \\(\\kappa = -\\infty\\) (rational/ruled), minimal models are not unique: \\(\\mathbb{P}^2\\) and the Hirzebruch surfaces \\(\\mathbb{F}_n\\) (\\(n \\neq 1\\)) are all minimal but mutually non-isomorphic.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Reducing to Minimal Model</div>
    <div class="env-body">
        <p>Start with \\(\\text{Bl}_{p_1, p_2, p_3} \\mathbb{P}^2\\), the blowup of \\(\\mathbb{P}^2\\) at 3 points. This has exceptional curves \\(E_1, E_2, E_3\\) with \\(E_i^2 = -1\\). Contract all three to recover \\(\\mathbb{P}^2\\). Alternatively, the strict transforms of lines through two blown-up points are also \\((-1)\\)-curves (since \\(\\tilde{L}^2 = 1 - 1 - 1 = -1\\)), giving different contraction paths.</p>
    </div>
</div>

<h3>Higher Dimensions: The Minimal Model Program</h3>

<div class="env-block remark">
    <div class="env-title">The MMP in Higher Dimensions</div>
    <div class="env-body">
        <p>In dimensions \\(\\geq 3\\), the MMP (due to Mori, Kawamata, Kollar, Shokurov, Birkar-Cascini-Hacon-McKernan, and many others) replaces the simple "contract \\((-1)\\)-curves" procedure with a more sophisticated algorithm:</p>
        <ol>
            <li><strong>Extremal ray contraction:</strong> Find a \\(K_X\\)-negative extremal ray in the cone of curves and contract it.</li>
            <li><strong>Flips:</strong> If the contraction is "small" (codimension \\(\\geq 2\\)), perform a <em>flip</em>, a birational surgery that replaces the contracted locus.</li>
            <li><strong>Termination:</strong> The process terminates (proved by Birkar-Cascini-Hacon-McKernan in 2010 for varieties of general type) with either a <strong>minimal model</strong> (\\(K_X\\) nef) or a <strong>Mori fiber space</strong> (\\(K_X\\)-negative fibration).</li>
        </ol>
        <p>This is one of the great achievements of 20th and 21st century algebraic geometry.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-minimal-model"></div>
`,
            visualizations: [
                {
                    id: 'viz-minimal-model',
                    title: 'Contracting (-1)-Curves to Reach a Minimal Model',
                    description: 'Step through the process of contracting exceptional curves. Each step removes a (-1)-curve and reduces the second Betti number by 1, until no (-1)-curves remain.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 1
                        });
                        var ctx = viz.ctx;
                        var step = 0;
                        var maxSteps = 3;
                        var animT = 0;
                        var animating = false;

                        VizEngine.createButton(controls, 'Contract next (-1)-curve', function() {
                            if (step < maxSteps) { animating = true; animT = 0; }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { step = 0; animating = false; animT = 0; });

                        var states = [
                            {
                                name: 'Bl\u2083P\u00B2: three exceptional curves',
                                b2: 4, curves: [
                                    { label: 'E\u2081', x: 150, y: 140, color: '#f85149', selfInt: -1 },
                                    { label: 'E\u2082', x: 300, y: 120, color: '#f85149', selfInt: -1 },
                                    { label: 'E\u2083', x: 420, y: 160, color: '#f85149', selfInt: -1 },
                                    { label: 'H', x: 280, y: 250, color: '#58a6ff', selfInt: 1 }
                                ]
                            },
                            {
                                name: 'Bl\u2082P\u00B2: two exceptional curves',
                                b2: 3, curves: [
                                    { label: 'E\u2082', x: 220, y: 130, color: '#f85149', selfInt: -1 },
                                    { label: 'E\u2083', x: 380, y: 150, color: '#f85149', selfInt: -1 },
                                    { label: 'H', x: 300, y: 240, color: '#58a6ff', selfInt: 1 }
                                ]
                            },
                            {
                                name: 'Bl\u2081P\u00B2: one exceptional curve',
                                b2: 2, curves: [
                                    { label: 'E\u2083', x: 300, y: 140, color: '#f85149', selfInt: -1 },
                                    { label: 'H', x: 300, y: 240, color: '#58a6ff', selfInt: 1 }
                                ]
                            },
                            {
                                name: 'P\u00B2: minimal model!',
                                b2: 1, curves: [
                                    { label: 'H', x: 300, y: 200, color: '#3fb950', selfInt: 1 }
                                ]
                            }
                        ];

                        function draw(t) {
                            viz.clear();
                            var st = states[step];

                            // Title
                            viz.screenText('Minimal Model via (-1)-Curve Contraction', 280, 18, viz.colors.white, 15);

                            // Surface shape
                            var shrink = step * 15;
                            ctx.strokeStyle = step === maxSteps ? viz.colors.green : viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(280, 200, 180 - shrink, 120 - shrink * 0.5, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.fillStyle = (step === maxSteps ? viz.colors.green : viz.colors.axis) + '11';
                            ctx.fill();

                            // Animate contraction
                            if (animating) {
                                animT += 0.015;
                                if (animT >= 1) {
                                    animT = 0;
                                    animating = false;
                                    step++;
                                }
                            }

                            // Draw curves for current state
                            var currentCurves = st.curves;
                            for (var i = 0; i < currentCurves.length; i++) {
                                var c = currentCurves[i];
                                var alpha = 1;

                                // If animating and this is the curve being contracted (first -1 curve)
                                if (animating && c.selfInt === -1 && i === 0) {
                                    alpha = 1 - animT;
                                }

                                // Draw as a small curve segment
                                ctx.save();
                                ctx.globalAlpha = alpha;
                                ctx.strokeStyle = c.color;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(c.x - 30, c.y + 10);
                                ctx.quadraticCurveTo(c.x, c.y - 15, c.x + 30, c.y + 10);
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = c.color;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(c.label + ' (' + c.selfInt + ')', c.x, c.y + 30);
                                ctx.restore();

                                // Contraction flash
                                if (animating && c.selfInt === -1 && i === 0 && animT > 0.5) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.beginPath();
                                    ctx.arc(c.x, c.y, 5 * (1 - animT) * 2, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Info
                            viz.screenText(st.name, 280, 340, step === maxSteps ? viz.colors.green : viz.colors.white, 14);
                            viz.screenText('b\u2082 = ' + st.b2, 280, 360, viz.colors.text, 12);

                            if (step === maxSteps) {
                                viz.screenText('No (-1)-curves remain. This is the minimal model.', 280, 385, viz.colors.green, 12);
                            } else {
                                var nMinus1 = st.curves.filter(function(c2) { return c2.selfInt === -1; }).length;
                                viz.screenText(nMinus1 + ' contractible (-1)-curve(s) remaining', 280, 385, viz.colors.red, 11);
                            }
                        }

                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\) minimal? Prove your answer.',
                    hint: 'Check whether it contains any \\((-1)\\)-curves. Consider the intersection form.',
                    solution: 'Yes, \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\) is minimal. Any curve \\(C \\sim aF + bG\\) has \\(C^2 = 2ab\\). If \\(C\\) is irreducible, then \\(a, b \\geq 0\\), so \\(C^2 \\geq 0\\). No curve has \\(C^2 = -1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to the Future
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<div class="bridge section-roadmap">
    <p><strong>Section goal:</strong> Connect the surface theory to higher-dimensional geometry, the Weil conjectures (Chapter 19), and modern research directions.</p>
</div>

<h2>From Surfaces to Higher Dimensions</h2>

<div class="env-block intuition">
    <div class="env-title">The View from the Summit</div>
    <div class="env-body">
        <p>The classification of surfaces is a triumph of late 19th and early 20th century mathematics, with modern contributions continuing to refine our understanding. But it is also a stepping stone. The Minimal Model Program extends the surface story to all dimensions, and intersection theory on higher-dimensional varieties leads to Chow rings, Schubert calculus, and the Grothendieck-Riemann-Roch theorem.</p>
    </div>
</div>

<h3>Connections</h3>

<div class="env-block remark">
    <div class="env-title">To Chapter 19: The Weil Conjectures</div>
    <div class="env-body">
        <p>The intersection theory on surfaces has an arithmetic counterpart. For a surface \\(S\\) over a finite field \\(\\mathbb{F}_q\\), the Weil conjectures (proved by Deligne) relate the number of \\(\\mathbb{F}_{q^n}\\)-points to the eigenvalues of Frobenius acting on \\(\\ell\\)-adic cohomology. The intersection form on \\(H^2\\) (the "middle cohomology" for a surface) plays a central role, and the Hodge index theorem becomes the Riemann hypothesis for the zeta function of \\(S\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Moduli of Surfaces</div>
    <div class="env-body">
        <p>Just as curves of genus \\(g\\) are parametrized by the moduli space \\(\\mathcal{M}_g\\), surfaces of general type are parametrized by a moduli space whose construction uses the Minimal Model Program. The <strong>KSBA compactification</strong> (Kollar-Shepherd-Barron-Alexeev) extends this to include degenerate surfaces, analogously to the Deligne-Mumford compactification \\(\\overline{\\mathcal{M}}_g\\) for curves.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Derived Categories and Mirror Symmetry</div>
    <div class="env-body">
        <p>K3 surfaces are central to <strong>mirror symmetry</strong> and the study of derived categories. Two K3 surfaces \\(X\\) and \\(Y\\) are called <em>derived equivalent</em> if \\(D^b(X) \\cong D^b(Y)\\) as triangulated categories. Mukai showed this happens if and only if the Hodge structures on \\(H^*(X, \\mathbb{Z})\\) and \\(H^*(Y, \\mathbb{Z})\\) are isomorphic, a beautiful interplay between algebraic geometry and homological algebra.</p>
    </div>
</div>

<h3>Summary of This Chapter</h3>

<div class="env-block remark">
    <div class="env-title">What We Covered</div>
    <div class="env-body">
        <ul>
            <li><strong>Intersection theory:</strong> The bilinear pairing \\(C \\cdot D\\), self-intersection, and the adjunction formula.</li>
            <li><strong>Blowups:</strong> Replacing a point by \\(\\mathbb{P}^1\\), the exceptional curve \\(E\\) with \\(E^2 = -1\\), Castelnuovo's contraction criterion.</li>
            <li><strong>Classification:</strong> The Enriques-Kodaira classification by Kodaira dimension \\(\\kappa \\in \\{-\\infty, 0, 1, 2\\}\\).</li>
            <li><strong>Minimal models:</strong> Contracting \\((-1)\\)-curves to reach the simplest representative; the MMP in higher dimensions.</li>
        </ul>
        <p>In Chapter 19, we complete our journey with the Weil conjectures, where the geometry of varieties over finite fields meets the deepest ideas of cohomology and number theory.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The Hodge index theorem states that the intersection form on \\(\\operatorname{NS}(S) \\otimes \\mathbb{R}\\) has signature \\((1, \\rho - 1)\\) for a surface with Picard number \\(\\rho\\). Verify this for \\(\\mathbb{P}^1 \\times \\mathbb{P}^1\\) (where \\(\\rho = 2\\)).',
                    hint: 'The intersection form in the basis \\(\\{F, G\\}\\) is \\(\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\). Compute its eigenvalues.',
                    solution: 'The matrix \\(\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\) has eigenvalues \\(+1\\) and \\(-1\\), so signature \\((1, 1)\\). This matches \\((1, \\rho - 1) = (1, 1)\\).'
                }
            ]
        }
    ]
});
