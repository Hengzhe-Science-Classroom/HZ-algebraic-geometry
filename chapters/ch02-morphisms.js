window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'Morphisms of Affine Varieties',
    subtitle: 'Maps between varieties and their algebraic counterparts',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Morphisms?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>In Chapter 0 we learned to associate geometric objects (algebraic sets) with polynomial equations, and in Chapter 1 we encoded those objects algebraically via coordinate rings. But so far our varieties sit in isolation. Mathematics becomes truly powerful when we study <em>maps</em> between objects: how do we relate one variety to another?</p>
        <p>A topologist studies continuous maps. A smooth geometer studies smooth maps. In algebraic geometry, the right notion of "map" is a <strong>morphism</strong>: a map defined by polynomials. This choice is not arbitrary; it is forced by the requirement that maps should respect the algebraic structure we have built.</p>
    </div>
</div>

<p>Consider the simplest example: the parabola \\(V = V(y - x^2) \\subseteq \\mathbb{A}^2\\) and the affine line \\(W = \\mathbb{A}^1\\). The map \\(\\varphi: W \\to V\\) defined by \\(t \\mapsto (t, t^2)\\) is given by polynomial functions. Its "inverse" is the projection \\(\\pi: V \\to W\\) sending \\((x, y) \\mapsto x\\). Both directions are polynomial maps, so \\(V\\) and \\(W\\) are "the same" as algebraic varieties. This is an <strong>isomorphism</strong>.</p>

<p>But now consider the cuspidal cubic \\(C = V(y^2 - x^3) \\subseteq \\mathbb{A}^2\\). The map \\(t \\mapsto (t^2, t^3)\\) sends \\(\\mathbb{A}^1\\) onto \\(C\\), and it is polynomial, hence a morphism. However, this map is <em>not</em> an isomorphism: the inverse map would have to send \\((x, y) \\mapsto y/x\\), which is not defined at the origin. Something subtle is happening at the cusp.</p>

<p>This chapter develops the theory of morphisms, the pullback homomorphism, isomorphisms, and rational maps, culminating in the fundamental anti-equivalence between varieties and finitely generated reduced \\(k\\)-algebras.</p>

<h3>What You Will Learn</h3>

<ol>
    <li><strong>Morphisms</strong> of affine varieties: polynomial maps and regular maps.</li>
    <li><strong>The pullback</strong> \\(\\varphi^*: k[W] \\to k[V]\\), and why it reverses arrows.</li>
    <li><strong>Isomorphisms</strong> vs. homeomorphisms: algebraic geometry is stricter than topology.</li>
    <li><strong>Rational maps</strong>: maps defined "almost everywhere," and birational equivalence.</li>
</ol>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Morphisms
        // ================================================================
        {
            id: 'sec-morphisms',
            title: 'Morphisms',
            content: `
<h2>Morphisms of Affine Varieties</h2>

<div class="env-block intuition">
    <div class="env-title">The Right Notion of Map</div>
    <div class="env-body">
        <p>In every branch of mathematics, the "right" maps are those that preserve the relevant structure. Group homomorphisms preserve the group operation. Continuous maps preserve open sets. For affine algebraic varieties, the structure comes from polynomials, so the right maps are those <em>defined by polynomials</em>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 2.1 (Morphism of Affine Varieties)</div>
    <div class="env-body">
        <p>Let \\(V \\subseteq \\mathbb{A}^n\\) and \\(W \\subseteq \\mathbb{A}^m\\) be affine algebraic varieties. A <strong>morphism</strong> (or <strong>polynomial map</strong>, or <strong>regular map</strong>) \\(\\varphi: V \\to W\\) is a map of the form</p>
        \\[\\varphi(a_1, \\ldots, a_n) = (f_1(a_1, \\ldots, a_n), \\ldots, f_m(a_1, \\ldots, a_n))\\]
        <p>where each \\(f_i \\in k[x_1, \\ldots, x_n]\\) is a polynomial, and \\(\\varphi(V) \\subseteq W\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Remark</div>
    <div class="env-body">
        <p>Strictly speaking, \\(\\varphi\\) is determined by the <em>restrictions</em> \\(\\bar{f}_i = f_i|_V\\), which are elements of the coordinate ring \\(k[V]\\). Different polynomials \\(f_i, f_i'\\) that agree on \\(V\\) (i.e., \\(f_i - f_i' \\in I(V)\\)) define the same morphism. So a morphism \\(\\varphi: V \\to \\mathbb{A}^m\\) is really given by an \\(m\\)-tuple of elements of \\(k[V]\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.2 (Projection)</div>
    <div class="env-body">
        <p>The <strong>projection</strong> \\(\\pi: \\mathbb{A}^2 \\to \\mathbb{A}^1\\) defined by \\(\\pi(x, y) = x\\) is a morphism. If \\(V = V(y - x^2)\\), then \\(\\pi|_V: V \\to \\mathbb{A}^1\\) is the restriction, sending \\((a, a^2) \\mapsto a\\). This is a morphism from the parabola to the line.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.3 (Parametrization of the Cuspidal Cubic)</div>
    <div class="env-body">
        <p>Let \\(C = V(y^2 - x^3) \\subseteq \\mathbb{A}^2\\). The map \\(\\varphi: \\mathbb{A}^1 \\to C\\) defined by \\(\\varphi(t) = (t^2, t^3)\\) is a morphism. Indeed:</p>
        <ul>
            <li>\\(f_1(t) = t^2\\) and \\(f_2(t) = t^3\\) are polynomials.</li>
            <li>For any \\(t\\), we have \\((t^3)^2 - (t^2)^3 = t^6 - t^6 = 0\\), so \\(\\varphi(t) \\in C\\). \\(\\checkmark\\)</li>
        </ul>
        <p>This map is surjective and injective, but it is <em>not</em> an isomorphism (we will see why shortly).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 2.4 (Morphisms are Continuous)</div>
    <div class="env-body">
        <p>Every morphism \\(\\varphi: V \\to W\\) is continuous in the Zariski topology.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>A closed set in \\(W\\) has the form \\(V_W(g_1, \\ldots, g_s)\\) for polynomials \\(g_j \\in k[y_1, \\ldots, y_m]\\). Then</p>
        \\[\\varphi^{-1}(V_W(g_1, \\ldots, g_s)) = \\{a \\in V : g_j(\\varphi(a)) = 0 \\text{ for all } j\\} = V_V(g_1 \\circ \\varphi, \\ldots, g_s \\circ \\varphi).\\]
        <p>Since each \\(g_j \\circ \\varphi\\) is a polynomial (composition of polynomials is polynomial), \\(\\varphi^{-1}\\) of a closed set is closed. Hence \\(\\varphi\\) is continuous.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block warning">
    <div class="env-title">The Converse is False</div>
    <div class="env-body">
        <p>Continuity in the Zariski topology does <em>not</em> imply that a map is a morphism. The Zariski topology is so coarse that many wild maps are continuous. For instance, any bijection \\(\\mathbb{A}^1 \\to \\mathbb{A}^1\\) that permutes a finite set of points and fixes the rest is Zariski continuous (since finite sets are closed), but most such maps are not polynomial.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 2.5 (Composition of Morphisms)</div>
    <div class="env-body">
        <p>If \\(\\varphi: U \\to V\\) and \\(\\psi: V \\to W\\) are morphisms, then so is \\(\\psi \\circ \\varphi: U \\to W\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>If \\(\\varphi\\) is given by polynomials \\(f_1, \\ldots, f_m\\) and \\(\\psi\\) by \\(g_1, \\ldots, g_p\\), then \\(\\psi \\circ \\varphi\\) is given by \\(g_1(f_1, \\ldots, f_m), \\ldots, g_p(f_1, \\ldots, f_m)\\). Each of these is a polynomial in the original variables.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>With morphisms as arrows, affine varieties form a <strong>category</strong>. The identity morphism \\(\\mathrm{id}_V: V \\to V\\) is given by the coordinate functions \\((x_1, \\ldots, x_n)\\), and composition is associative. This categorical viewpoint is the gateway to modern algebraic geometry.</p>

<div class="viz-placeholder" data-viz="viz-morphism-demo"></div>
`,
            visualizations: [
                {
                    id: 'viz-morphism-demo',
                    title: 'Morphism Demo: Map V to W',
                    description: 'A morphism sends points of one variety to another by polynomial formulas. Drag the point on V (the parabola) and watch its image move on W (the line). The fibers (preimages) of a point on W are highlighted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 140, originY: 180, scale: 35
                        });

                        var ptX = 1.0;
                        var showFiber = false;
                        var fiberTarget = 1.0;

                        VizEngine.createSlider(controls, 'Point t', -2.5, 2.5, ptX, 0.05, function(v) {
                            ptX = v;
                            draw();
                        });

                        var fiberSlider = VizEngine.createSlider(controls, 'Fiber over y =', 0, 4, fiberTarget, 0.1, function(v) {
                            fiberTarget = v;
                            showFiber = true;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Left side: V = parabola y = x^2
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Draw parabola
                            viz.drawFunction(function(x) { return x * x; }, -3, 3, viz.colors.blue, 2.5);

                            // Right side indicator
                            var rightX = viz.width - 100;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(rightX, 20);
                            ctx.lineTo(rightX, viz.height - 20);
                            ctx.stroke();

                            // Label the right axis
                            viz.screenText('W = A\u00B9', rightX + 30, 15, viz.colors.teal, 12);
                            viz.screenText('V = V(y - x\u00B2)', 70, 15, viz.colors.blue, 12);

                            // Tick marks on right axis
                            for (var i = -2; i <= 6; i++) {
                                var ty = viz.height / 2 - i * 30;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(rightX - 4, ty);
                                ctx.lineTo(rightX + 4, ty);
                                ctx.stroke();
                                if (i >= 0 && i <= 5) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(i.toString(), rightX + 8, ty);
                                }
                            }

                            // Draw point on V
                            var px = ptX;
                            var py = ptX * ptX;
                            viz.drawPoint(px, py, viz.colors.orange, '(' + px.toFixed(1) + ', ' + py.toFixed(1) + ')', 6);

                            // Draw arrow from point to right axis
                            var imgY = viz.height / 2 - py * 30;
                            var srcScreen = viz.toScreen(px, py);
                            ctx.strokeStyle = viz.colors.orange + 'aa';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(srcScreen[0], srcScreen[1]);
                            ctx.lineTo(rightX - 8, imgY);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Draw image point on W
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(rightX, imgY, 6, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('\u03C6(t) = t\u00B2 = ' + py.toFixed(2), rightX + 14, imgY);

                            // Fiber visualization
                            if (showFiber && fiberTarget >= 0) {
                                var fiberY = viz.height / 2 - fiberTarget * 30;
                                ctx.fillStyle = viz.colors.purple + '44';
                                ctx.fillRect(rightX - 10, fiberY - 4, 20, 8);
                                ctx.fillStyle = viz.colors.purple;
                                ctx.beginPath();
                                ctx.arc(rightX, fiberY, 5, 0, Math.PI * 2);
                                ctx.fill();

                                // Draw horizontal line on V at height fiberTarget
                                var sqr = Math.sqrt(fiberTarget);
                                if (fiberTarget > 0.01) {
                                    // Two preimages
                                    viz.drawPoint(sqr, fiberTarget, viz.colors.purple, '+\u221A' + fiberTarget.toFixed(1), 5);
                                    viz.drawPoint(-sqr, fiberTarget, viz.colors.purple, '-\u221A' + fiberTarget.toFixed(1), 5);

                                    // Horizontal dashed line
                                    var syFib = viz.toScreen(0, fiberTarget)[1];
                                    ctx.strokeStyle = viz.colors.purple + '44';
                                    ctx.lineWidth = 1;
                                    ctx.setLineDash([3, 3]);
                                    ctx.beginPath();
                                    ctx.moveTo(0, syFib);
                                    ctx.lineTo(viz.width - 120, syFib);
                                    ctx.stroke();
                                    ctx.setLineDash([]);

                                    viz.screenText('\u03C6\u207B\u00B9(' + fiberTarget.toFixed(1) + ') = {\u00B1' + sqr.toFixed(2) + '}', 200, viz.height - 15, viz.colors.purple, 11);
                                } else {
                                    viz.drawPoint(0, 0, viz.colors.purple, 'origin', 5);
                                    viz.screenText('\u03C6\u207B\u00B9(0) = {0}', 200, viz.height - 15, viz.colors.purple, 11);
                                }
                            }

                            // Morphism label
                            viz.screenText('\u03C6: (x,y) \u21A6 y    (projection onto y-axis)', viz.width / 2, viz.height - 35, viz.colors.white, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the map \\(\\varphi: \\mathbb{A}^1 \\to \\mathbb{A}^2\\) defined by \\(\\varphi(t) = (t^2 - 1, t^3 - t)\\) has image contained in \\(V(y^2 - x^2(x+1))\\).',
                    hint: 'Substitute \\(x = t^2 - 1\\) and \\(y = t^3 - t\\) into \\(y^2 - x^2(x+1)\\) and simplify. Factor \\(t^3 - t = t(t^2-1)\\).',
                    solution: 'We have \\(y = t^3 - t = t(t^2 - 1) = tx\\). Then \\(y^2 = t^2 x^2\\) and \\(x^2(x+1) = x^2(t^2 - 1 + 1) = x^2 t^2\\). So \\(y^2 - x^2(x+1) = t^2 x^2 - t^2 x^2 = 0\\). The image lies on the nodal cubic.'
                },
                {
                    question: 'Let \\(\\varphi: \\mathbb{A}^2 \\to \\mathbb{A}^2\\) be defined by \\(\\varphi(x,y) = (x, xy)\\). Show that \\(\\varphi\\) is a morphism and describe the image. Is \\(\\varphi\\) surjective?',
                    hint: 'The image of \\((a,b)\\) is \\((a, ab)\\). Consider: which points \\((u,v)\\) in the codomain are hit? What happens when \\(u = 0\\)?',
                    solution: 'The map is polynomial, hence a morphism. If \\(u \\neq 0\\), then \\((u, v)\\) is the image of \\((u, v/u)\\). If \\(u = 0\\), only \\((0, 0)\\) is in the image (since \\(v = 0 \\cdot y = 0\\)). So the image is \\(\\{(u,v) : u \\neq 0\\} \\cup \\{(0,0)\\}\\), which is neither open nor closed. In particular, \\(\\varphi\\) is not surjective; the point \\((0, 1)\\) is not in the image.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Pullback
        // ================================================================
        {
            id: 'sec-pullback',
            title: 'The Pullback',
            content: `
<h2>The Pullback Homomorphism</h2>

<div class="env-block intuition">
    <div class="env-title">Functions Pull Back</div>
    <div class="env-body">
        <p>Here is a fundamental observation. Suppose \\(\\varphi: V \\to W\\) is a morphism and \\(f: W \\to k\\) is a regular function on \\(W\\) (an element of \\(k[W]\\)). Then the composition \\(f \\circ \\varphi: V \\to k\\) is a regular function on \\(V\\) (an element of \\(k[V]\\)).</p>
        <p>This operation, sending \\(f\\) to \\(f \\circ \\varphi\\), is called the <strong>pullback</strong>. It goes in the <em>opposite</em> direction: while \\(\\varphi\\) maps \\(V \\to W\\), the pullback maps \\(k[W] \\to k[V]\\). This reversal of arrows is one of the most important ideas in mathematics.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 2.6 (Pullback Homomorphism)</div>
    <div class="env-body">
        <p>Let \\(\\varphi: V \\to W\\) be a morphism. The <strong>pullback</strong> of \\(\\varphi\\) is the ring homomorphism</p>
        \\[\\varphi^*: k[W] \\to k[V], \\qquad f \\mapsto f \\circ \\varphi.\\]
        <p>This is a \\(k\\)-algebra homomorphism: it preserves addition, multiplication, and scalar multiplication.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.7</div>
    <div class="env-body">
        <p>Let \\(V = V(y - x^2) \\subseteq \\mathbb{A}^2\\) and \\(W = \\mathbb{A}^1\\). Consider the projection \\(\\pi: V \\to W\\) given by \\(\\pi(x, y) = x\\).</p>
        <p>The coordinate ring of \\(W\\) is \\(k[W] = k[t]\\). The pullback sends \\(t \\mapsto x\\) (viewed as an element of \\(k[V] = k[x,y]/(y - x^2) \\cong k[x]\\)). So \\(\\pi^*: k[t] \\to k[x]\\) is the identity map (after identifying \\(t\\) with \\(x\\)). This is an isomorphism of \\(k\\)-algebras, reflecting the fact that \\(\\pi\\) is an isomorphism of varieties.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.8</div>
    <div class="env-body">
        <p>Let \\(C = V(y^2 - x^3)\\) and consider the parametrization \\(\\varphi: \\mathbb{A}^1 \\to C\\) by \\(\\varphi(t) = (t^2, t^3)\\). The coordinate ring of \\(C\\) is \\(k[C] = k[x, y]/(y^2 - x^3)\\). The pullback is</p>
        \\[\\varphi^*: k[C] \\to k[t], \\qquad \\bar{x} \\mapsto t^2, \\quad \\bar{y} \\mapsto t^3.\\]
        <p>The image of \\(\\varphi^*\\) is \\(k[t^2, t^3] \\subsetneq k[t]\\); for instance, \\(t \\notin k[t^2, t^3]\\). So \\(\\varphi^*\\) is <em>not</em> surjective, which means \\(\\varphi\\) is <em>not</em> an isomorphism, even though it is a bijection!</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.9 (Anti-Equivalence of Categories)</div>
    <div class="env-body">
        <p>The pullback construction defines a contravariant equivalence between:</p>
        <ul>
            <li>The category of affine varieties over \\(k\\) (with morphisms), and</li>
            <li>The opposite of the category of finitely generated reduced \\(k\\)-algebras (with \\(k\\)-algebra homomorphisms).</li>
        </ul>
        <p>Explicitly:</p>
        <ol>
            <li>\\(V \\mapsto k[V]\\) on objects.</li>
            <li>\\(\\varphi \\mapsto \\varphi^*\\) on morphisms (reversing arrows).</li>
            <li>Every \\(k\\)-algebra homomorphism \\(\\alpha: k[W] \\to k[V]\\) arises as \\(\\varphi^*\\) for a unique morphism \\(\\varphi: V \\to W\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p><strong>Functoriality:</strong> \\((\\psi \\circ \\varphi)^* = \\varphi^* \\circ \\psi^*\\) (note the reversal). This is because \\(f \\mapsto f \\circ (\\psi \\circ \\varphi) = (f \\circ \\psi) \\circ \\varphi\\).</p>
        <p><strong>Recovering morphisms from ring maps:</strong> Given \\(\\alpha: k[W] \\to k[V]\\), write \\(k[W] = k[y_1, \\ldots, y_m]/I(W)\\). Set \\(f_i = \\alpha(\\bar{y}_i) \\in k[V]\\). Then \\(\\varphi = (f_1, \\ldots, f_m): V \\to \\mathbb{A}^m\\) sends \\(V\\) into \\(W\\) (because \\(\\alpha\\) respects the ideal \\(I(W)\\)), and \\(\\varphi^* = \\alpha\\).</p>
        <p>The details require the Nullstellensatz and are carried out in the exercises.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Why "Anti"?</div>
    <div class="env-body">
        <p>The prefix "anti" (or "contravariant") means that the functor reverses the direction of arrows: a morphism \\(V \\to W\\) becomes a ring map \\(k[W] \\to k[V]\\). This reversal is a recurring theme in mathematics:</p>
        <ul>
            <li>Topology: a continuous map \\(X \\to Y\\) induces \\(C(Y) \\to C(X)\\) on function rings.</li>
            <li>Differential geometry: a smooth map \\(M \\to N\\) induces \\(C^\\infty(N) \\to C^\\infty(M)\\).</li>
            <li>Commutative algebra: a ring map \\(A \\to B\\) induces \\(\\operatorname{Spec} B \\to \\operatorname{Spec} A\\) (the foundation of scheme theory).</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pullback"></div>
`,
            visualizations: [
                {
                    id: 'viz-pullback',
                    title: 'The Pullback: Functions Pull Back',
                    description: 'A function \\(f\\) on \\(W\\) "pulls back" to \\(f \\circ \\varphi\\) on \\(V\\). Watch how a function on the codomain transforms into a function on the domain. The morphism goes right, but functions go left.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var animT = 0;
                        var animating = false;
                        var funcChoice = 0;
                        var funcNames = ['f(u) = u', 'f(u) = u\u00B2', 'f(u) = u + 1'];
                        var funcs = [
                            function(u) { return u; },
                            function(u) { return u * u; },
                            function(u) { return u + 1; }
                        ];

                        VizEngine.createButton(controls, 'Animate Pullback', function() {
                            if (animating) return;
                            animating = true;
                            animT = 0;
                            viz.animate(function(t) {
                                animT = Math.min(1, animT + 0.012);
                                drawFrame(animT);
                                if (animT >= 1) {
                                    viz.stopAnimation();
                                    animating = false;
                                }
                            });
                        });

                        VizEngine.createButton(controls, 'Next f', function() {
                            funcChoice = (funcChoice + 1) % funcs.length;
                            animT = 0;
                            drawFrame(0);
                        });

                        function drawFrame(t) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var midX = W / 2;

                            // Labels
                            viz.screenText('V = A\u00B9', midX / 2, 20, viz.colors.blue, 14);
                            viz.screenText('W = A\u00B9', midX + midX / 2, 20, viz.colors.teal, 14);

                            // Morphism arrow (right)
                            var arrowY = 45;
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(midX / 2 + 40, arrowY);
                            ctx.lineTo(midX + midX / 2 - 40, arrowY);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.beginPath();
                            ctx.moveTo(midX + midX / 2 - 40, arrowY);
                            ctx.lineTo(midX + midX / 2 - 50, arrowY - 5);
                            ctx.lineTo(midX + midX / 2 - 50, arrowY + 5);
                            ctx.closePath();
                            ctx.fill();
                            viz.screenText('\u03C6(t) = t\u00B2', midX, arrowY - 10, viz.colors.white, 11);

                            // Pullback arrow (left, lower)
                            var pullY = 65;
                            var pullAlpha = t;
                            if (pullAlpha > 0) {
                                ctx.globalAlpha = pullAlpha;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(midX + midX / 2 - 40, pullY);
                                ctx.lineTo(midX / 2 + 40, pullY);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.moveTo(midX / 2 + 40, pullY);
                                ctx.lineTo(midX / 2 + 50, pullY - 5);
                                ctx.lineTo(midX / 2 + 50, pullY + 5);
                                ctx.closePath();
                                ctx.fill();
                                viz.screenText('\u03C6* pulls back', midX, pullY + 12, viz.colors.orange, 11);
                                ctx.globalAlpha = 1;
                            }

                            // Axes for both sides
                            var axisBottom = H - 50;
                            var axisTop = 100;
                            var axisH = axisBottom - axisTop;

                            // Left axis (V)
                            var leftAxisX = midX / 2;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(30, axisBottom);
                            ctx.lineTo(midX - 20, axisBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(leftAxisX, axisTop - 10);
                            ctx.lineTo(leftAxisX, axisBottom + 5);
                            ctx.stroke();

                            // Right axis (W)
                            var rightAxisX = midX + midX / 2;
                            ctx.beginPath();
                            ctx.moveTo(midX + 20, axisBottom);
                            ctx.lineTo(W - 20, axisBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(rightAxisX, axisTop - 10);
                            ctx.lineTo(rightAxisX, axisBottom + 5);
                            ctx.stroke();

                            // Plot f on W (right side)
                            var f = funcs[funcChoice];
                            var tRange = 3;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 200; i++) {
                                var u = -tRange + 2 * tRange * i / 200;
                                var fv = f(u);
                                var sx = rightAxisX + u * (midX / 2 - 30) / tRange;
                                var sy = axisBottom - (fv + tRange) / (2 * tRange) * axisH;
                                if (sx < midX + 20 || sx > W - 20 || sy < axisTop - 10 || sy > axisBottom + 5) {
                                    started = false;
                                    continue;
                                }
                                if (!started) { ctx.moveTo(sx, sy); started = true; }
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();
                            viz.screenText(funcNames[funcChoice] + ' on W', midX + midX / 2, axisTop - 20, viz.colors.teal, 11);

                            // Plot pullback f(t^2) on V (left side)
                            var pbAlpha = Math.min(1, t * 2);
                            if (pbAlpha > 0.01) {
                                ctx.globalAlpha = pbAlpha;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                started = false;
                                for (var j = 0; j <= 200; j++) {
                                    var tVal = -tRange + 2 * tRange * j / 200;
                                    var pb = f(tVal * tVal);
                                    var lx = leftAxisX + tVal * (midX / 2 - 30) / tRange;
                                    var ly = axisBottom - (pb + tRange) / (2 * tRange) * axisH;
                                    if (lx < 30 || lx > midX - 20 || ly < axisTop - 10 || ly > axisBottom + 5) {
                                        started = false;
                                        continue;
                                    }
                                    if (!started) { ctx.moveTo(lx, ly); started = true; }
                                    else ctx.lineTo(lx, ly);
                                }
                                ctx.stroke();
                                ctx.globalAlpha = 1;

                                var pbName = funcChoice === 0 ? '\u03C6*f(t) = t\u00B2' : (funcChoice === 1 ? '\u03C6*f(t) = t\u2074' : '\u03C6*f(t) = t\u00B2+1');
                                viz.screenText(pbName + ' on V', leftAxisX, axisTop - 20, viz.colors.orange, 11);
                            }

                            // Axis labels
                            viz.screenText('t', midX / 2 + 5, axisBottom + 18, viz.colors.text, 10);
                            viz.screenText('u', midX + midX / 2 + 5, axisBottom + 18, viz.colors.text, 10);
                        }
                        drawFrame(0);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(\\varphi: \\mathbb{A}^1 \\to \\mathbb{A}^1\\) be defined by \\(\\varphi(t) = t^2\\). Compute \\(\\varphi^*: k[u] \\to k[t]\\) explicitly. What is \\(\\varphi^*(u^3 + 2u + 1)\\)?',
                    hint: 'The pullback sends \\(u \\mapsto t^2\\). Apply this substitution to \\(u^3 + 2u + 1\\).',
                    solution: '\\(\\varphi^*(u) = u \\circ \\varphi = t^2\\). So \\(\\varphi^*\\) is the substitution \\(u \\mapsto t^2\\). Then \\(\\varphi^*(u^3 + 2u + 1) = (t^2)^3 + 2(t^2) + 1 = t^6 + 2t^2 + 1\\).'
                },
                {
                    question: 'Show that if \\(\\varphi: V \\to W\\) and \\(\\psi: W \\to U\\) are morphisms, then \\((\\psi \\circ \\varphi)^* = \\varphi^* \\circ \\psi^*\\). Why does the order reverse?',
                    hint: 'For \\(f \\in k[U]\\), compute \\((\\psi \\circ \\varphi)^*(f)\\) using the definition \\(f \\mapsto f \\circ (\\psi \\circ \\varphi)\\), then use associativity of composition.',
                    solution: 'For \\(f \\in k[U]\\): \\((\\psi \\circ \\varphi)^*(f) = f \\circ (\\psi \\circ \\varphi) = (f \\circ \\psi) \\circ \\varphi = \\varphi^*(f \\circ \\psi) = \\varphi^*(\\psi^*(f)) = (\\varphi^* \\circ \\psi^*)(f)\\). The order reverses because composition is "applied from the outside in": to pull back from \\(U\\) all the way to \\(V\\), we first apply \\(\\psi^*\\) (pulling \\(U \\to W\\)), then \\(\\varphi^*\\) (pulling \\(W \\to V\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Isomorphisms
        // ================================================================
        {
            id: 'sec-isomorphism',
            title: 'Isomorphisms',
            content: `
<h2>Isomorphisms of Varieties</h2>

<div class="env-block intuition">
    <div class="env-title">When Are Two Varieties "the Same"?</div>
    <div class="env-body">
        <p>Two varieties \\(V\\) and \\(W\\) are <strong>isomorphic</strong> if there exist morphisms \\(\\varphi: V \\to W\\) and \\(\\psi: W \\to V\\) such that \\(\\psi \\circ \\varphi = \\mathrm{id}_V\\) and \\(\\varphi \\circ \\psi = \\mathrm{id}_W\\). Equivalently (by Theorem 2.9), \\(V \\cong W\\) if and only if \\(k[V] \\cong k[W]\\) as \\(k\\)-algebras.</p>
        <p>This is <em>much</em> stricter than topological equivalence. Two varieties can be homeomorphic in the Zariski topology without being isomorphic.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 2.10 (Isomorphism)</div>
    <div class="env-body">
        <p>A morphism \\(\\varphi: V \\to W\\) is an <strong>isomorphism</strong> if there exists a morphism \\(\\psi: W \\to V\\) such that \\(\\psi \\circ \\varphi = \\mathrm{id}_V\\) and \\(\\varphi \\circ \\psi = \\mathrm{id}_W\\). We write \\(V \\cong W\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.11 (The Parabola is Isomorphic to the Line)</div>
    <div class="env-body">
        <p>Let \\(V = V(y - x^2) \\subseteq \\mathbb{A}^2\\). Define \\(\\varphi: V \\to \\mathbb{A}^1\\) by \\(\\varphi(x,y) = x\\) and \\(\\psi: \\mathbb{A}^1 \\to V\\) by \\(\\psi(t) = (t, t^2)\\). Then:</p>
        <ul>
            <li>\\(\\varphi \\circ \\psi(t) = \\varphi(t, t^2) = t\\). \\(\\checkmark\\)</li>
            <li>\\(\\psi \\circ \\varphi(x, y) = \\psi(x) = (x, x^2) = (x, y)\\) on \\(V\\). \\(\\checkmark\\)</li>
        </ul>
        <p>Algebraically: \\(k[V] = k[x,y]/(y - x^2) \\cong k[x]\\) via \\(y \\mapsto x^2\\). And \\(k[\\mathbb{A}^1] = k[t]\\). Both are polynomial rings in one variable. \\(\\checkmark\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.12 (The Cuspidal Cubic is NOT Isomorphic to the Line)</div>
    <div class="env-body">
        <p>Let \\(C = V(y^2 - x^3)\\). We showed that \\(\\varphi: \\mathbb{A}^1 \\to C\\) by \\(t \\mapsto (t^2, t^3)\\) is a bijection. But \\(\\varphi\\) is not an isomorphism.</p>
        <p><strong>Proof via coordinate rings:</strong> \\(k[C] = k[x,y]/(y^2 - x^3)\\). If \\(C \\cong \\mathbb{A}^1\\), then \\(k[C] \\cong k[t]\\). But \\(k[t]\\) is a UFD with the property that every element is a \\(k\\)-linear combination of powers of a single generator. In \\(k[C]\\), the elements \\(\\bar{x}\\) and \\(\\bar{y}\\) satisfy \\(\\bar{y}^2 = \\bar{x}^3\\). If \\(k[C] \\cong k[t]\\), writing \\(\\bar{x} = p(t)\\) and \\(\\bar{y} = q(t)\\), we need \\(q(t)^2 = p(t)^3\\). Comparing degrees: \\(2 \\deg q = 3 \\deg p\\), so \\(\\deg p = 2, \\deg q = 3\\). But then \\(k[p(t), q(t)] = k[t^2, t^3] \\neq k[t]\\) (the element \\(t\\) cannot be expressed as a polynomial in \\(t^2\\) and \\(t^3\\)). Contradiction.</p>
    </div>
</div>

<div class="env-block warning">
    <div class="env-title">Bijection \\(\\neq\\) Isomorphism</div>
    <div class="env-body">
        <p>The cuspidal cubic example is the canonical warning: a bijective morphism need not be an isomorphism. In topology, a continuous bijection from a compact space to a Hausdorff space is automatically a homeomorphism. No such miracle occurs in algebraic geometry. The problem is the cusp at the origin, where the inverse map would require \\(y/x\\), a rational (not polynomial) function.</p>
    </div>
</div>

<div class="env-block theorem">
    <div name="env-title">Theorem 2.13 (Isomorphism Criterion)</div>
    <div class="env-body">
        <p>A morphism \\(\\varphi: V \\to W\\) is an isomorphism if and only if the pullback \\(\\varphi^*: k[W] \\to k[V]\\) is an isomorphism of \\(k\\)-algebras.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-projection"></div>
`,
            visualizations: [
                {
                    id: 'viz-projection',
                    title: 'Projection of the Twisted Cubic',
                    description: 'The twisted cubic \\(t \\mapsto (t, t^2, t^3)\\) lives in \\(\\mathbb{A}^3\\). Projecting onto different coordinate planes yields different plane curves. Some projections are isomorphisms, others are not (they have fibers with more than one point). Rotate to see the 3D curve and its shadow.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 50
                        });

                        var angle = 0.6;
                        var elevation = 0.4;
                        var projMode = 0;
                        var projNames = ['(x,y) plane', '(x,z) plane', '(y,z) plane'];

                        VizEngine.createSlider(controls, 'Rotate', 0, 6.28, angle, 0.05, function(v) {
                            angle = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Elevation', -1.2, 1.2, elevation, 0.05, function(v) {
                            elevation = v;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Projection', function() {
                            projMode = (projMode + 1) % 3;
                            draw();
                        });

                        function project3D(x, y, z) {
                            var cosA = Math.cos(angle), sinA = Math.sin(angle);
                            var cosE = Math.cos(elevation), sinE = Math.sin(elevation);
                            var rx = x * cosA - y * sinA;
                            var ry = x * sinA * sinE + y * cosA * sinE + z * cosE;
                            return [rx, ry];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Twisted Cubic: t \u21A6 (t, t\u00B2, t\u00B3)', viz.width / 2, 18, viz.colors.white, 13);
                            viz.screenText('Projection onto ' + projNames[projMode], viz.width / 2, 38, viz.colors.teal, 11);

                            // Draw 3D axes
                            var axes = [[1.5, 0, 0], [0, 1.5, 0], [0, 0, 1.5]];
                            var axisLabels = ['x', 'y', 'z'];
                            var axisColors = [viz.colors.red + '88', viz.colors.green + '88', viz.colors.blue + '88'];
                            for (var a = 0; a < 3; a++) {
                                var p0 = project3D(0, 0, 0);
                                var p1 = project3D(axes[a][0], axes[a][1], axes[a][2]);
                                viz.drawSegment(p0[0], p0[1], p1[0], p1[1], axisColors[a], 1, true);
                                viz.drawText(axisLabels[a], p1[0] * 1.1, p1[1] * 1.1, axisColors[a], 11);
                            }

                            // Draw twisted cubic in 3D
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var first = true;
                            for (var i = 0; i <= 200; i++) {
                                var t = -1.3 + 2.6 * i / 200;
                                var p = project3D(t, t * t, t * t * t);
                                var sx = viz.originX + p[0] * viz.scale;
                                var sy = viz.originY - p[1] * viz.scale;
                                if (first) { ctx.moveTo(sx, sy); first = false; }
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Draw projected curve (shadow)
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            first = true;
                            for (var j = 0; j <= 200; j++) {
                                var t2 = -1.3 + 2.6 * j / 200;
                                var px, py, pz;
                                if (projMode === 0) { px = t2; py = t2 * t2; pz = -1.5; }
                                else if (projMode === 1) { px = t2; py = -1.5; pz = t2 * t2 * t2; }
                                else { px = -1.5; py = t2 * t2; pz = t2 * t2 * t2; }
                                var pp = project3D(px, py, pz);
                                var ssx = viz.originX + pp[0] * viz.scale;
                                var ssy = viz.originY - pp[1] * viz.scale;
                                if (first) { ctx.moveTo(ssx, ssy); first = false; }
                                else ctx.lineTo(ssx, ssy);
                            }
                            ctx.stroke();

                            // Mark a sample point and its projection
                            var tSample = 0.8;
                            var p3d = project3D(tSample, tSample * tSample, tSample * tSample * tSample);
                            viz.drawPoint(p3d[0], p3d[1], viz.colors.orange, 't=' + tSample.toFixed(1), 5);

                            var ppx, ppy, ppz;
                            if (projMode === 0) { ppx = tSample; ppy = tSample * tSample; ppz = -1.5; }
                            else if (projMode === 1) { ppx = tSample; ppy = -1.5; ppz = tSample * tSample * tSample; }
                            else { ppx = -1.5; ppy = tSample * tSample; ppz = tSample * tSample * tSample; }
                            var pProj = project3D(ppx, ppy, ppz);
                            viz.drawPoint(pProj[0], pProj[1], viz.colors.teal, null, 4);

                            viz.drawSegment(p3d[0], p3d[1], pProj[0], pProj[1], viz.colors.orange + '55', 1, true);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the hyperbola \\(V(xy - 1) \\subseteq \\mathbb{A}^2\\) is <em>not</em> isomorphic to \\(\\mathbb{A}^1\\).',
                    hint: 'Compute the coordinate rings. \\(k[V(xy-1)] = k[x, y]/(xy - 1) \\cong k[x, x^{-1}]\\). Is this isomorphic to \\(k[t]\\)? Think about units (invertible elements).',
                    solution: 'The coordinate ring is \\(k[x, x^{-1}]\\) (the ring of Laurent polynomials in one variable). In \\(k[t]\\), the only units are the nonzero constants \\(k^*\\). In \\(k[x, x^{-1}]\\), the element \\(x\\) is a unit (with inverse \\(x^{-1}\\)). Since isomorphic rings have isomorphic unit groups, \\(k[x, x^{-1}] \\not\\cong k[t]\\). Hence \\(V(xy - 1) \\not\\cong \\mathbb{A}^1\\).'
                },
                {
                    question: 'Prove that \\(\\mathbb{A}^1 \\setminus \\{0\\}\\) (the punctured line) is isomorphic as a variety to \\(V(xy - 1) \\subseteq \\mathbb{A}^2\\).',
                    hint: 'The punctured line is not an affine algebraic set in \\(\\mathbb{A}^1\\), but it <em>is</em> isomorphic to the hyperbola \\(V(xy-1)\\). Construct explicit mutually inverse morphisms.',
                    solution: 'Define \\(\\varphi: V(xy-1) \\to \\mathbb{A}^1 \\setminus \\{0\\}\\) by \\(\\varphi(a,b) = a\\) and \\(\\psi: \\mathbb{A}^1 \\setminus \\{0\\} \\to V(xy-1)\\) by \\(\\psi(t) = (t, 1/t)\\). On \\(V(xy-1)\\): \\(\\psi(\\varphi(a,b)) = (a, 1/a) = (a, b)\\) since \\(ab = 1\\). And \\(\\varphi(\\psi(t)) = t\\). Both maps are regular (\\(1/t\\) is regular on the punctured line), so this is an isomorphism. The coordinate ring \\(k[x, x^{-1}]\\) is the same on both sides.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Rational Maps
        // ================================================================
        {
            id: 'sec-rational-maps',
            title: 'Rational Maps',
            content: `
<h2>Rational Maps and Birational Equivalence</h2>

<div class="env-block intuition">
    <div class="env-title">Maps Defined "Almost Everywhere"</div>
    <div class="env-body">
        <p>A morphism must be defined at every point of the domain. But many natural maps fail at isolated points. The map \\((x, y) \\mapsto y/x\\) is perfectly good away from the \\(y\\)-axis, but it blows up where \\(x = 0\\). Rather than discarding such maps, algebraic geometry embraces them as <strong>rational maps</strong>: maps defined on a dense open subset.</p>
        <p>This leads to a coarser equivalence relation, <strong>birational equivalence</strong>, where two varieties are "the same" if they agree on dense open subsets. Birational geometry is one of the central themes of modern algebraic geometry.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 2.14 (Rational Map)</div>
    <div class="env-body">
        <p>A <strong>rational map</strong> \\(\\varphi: V \\dashrightarrow W\\) is an equivalence class of pairs \\((U, \\varphi_U)\\) where \\(U \\subseteq V\\) is a non-empty open subset and \\(\\varphi_U: U \\to W\\) is a morphism. Two pairs \\((U_1, \\varphi_1)\\) and \\((U_2, \\varphi_2)\\) are equivalent if \\(\\varphi_1 = \\varphi_2\\) on \\(U_1 \\cap U_2\\).</p>
        <p>The dashed arrow \\(\\dashrightarrow\\) warns us that the map may not be defined everywhere.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 2.15 (Domain of Definition)</div>
    <div class="env-body">
        <p>The <strong>domain of definition</strong> of a rational map \\(\\varphi: V \\dashrightarrow W\\) is the largest open set \\(U \\subseteq V\\) on which some representative of \\(\\varphi\\) is defined. The complement \\(V \\setminus U\\) is the <strong>indeterminacy locus</strong>.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.16 (Projection from a Point)</div>
    <div class="env-body">
        <p>Consider the rational map \\(\\varphi: \\mathbb{A}^2 \\dashrightarrow \\mathbb{A}^1\\) defined by \\(\\varphi(x, y) = y/x\\). This is defined on the open set \\(\\{x \\neq 0\\}\\). The indeterminacy locus is the \\(y\\)-axis \\(\\{x = 0\\}\\).</p>
        <p>Restricted to the variety \\(V = V(y - x^2)\\), the map becomes \\(\\varphi(x, x^2) = x^2/x = x\\), which extends to a morphism on all of \\(V\\). So the indeterminacy of \\(\\varphi\\) on \\(\\mathbb{A}^2\\) disappears when we restrict to the parabola.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 2.17 (Birational Equivalence)</div>
    <div class="env-body">
        <p>Two varieties \\(V\\) and \\(W\\) are <strong>birationally equivalent</strong> (written \\(V \\sim_{\\mathrm{bir}} W\\)) if there exist rational maps \\(\\varphi: V \\dashrightarrow W\\) and \\(\\psi: W \\dashrightarrow V\\) such that \\(\\psi \\circ \\varphi = \\mathrm{id}_V\\) and \\(\\varphi \\circ \\psi = \\mathrm{id}_W\\) wherever both sides are defined.</p>
        <p>Equivalently, \\(V \\sim_{\\mathrm{bir}} W\\) if and only if the function fields \\(k(V) \\cong k(W)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2.18 (The Cuspidal Cubic is Rational)</div>
    <div class="env-body">
        <p>The cuspidal cubic \\(C = V(y^2 - x^3)\\) is birationally equivalent to \\(\\mathbb{A}^1\\), even though it is not isomorphic to it. The map \\(\\varphi: \\mathbb{A}^1 \\to C\\) by \\(t \\mapsto (t^2, t^3)\\) is a morphism. The "inverse" \\(\\psi: C \\dashrightarrow \\mathbb{A}^1\\) by \\((x,y) \\mapsto y/x\\) is a rational map defined on \\(C \\setminus \\{(0,0)\\}\\). On this open set, \\(\\psi(\\varphi(t)) = t^3/t^2 = t\\) and \\(\\varphi(\\psi(x,y)) = ((y/x)^2, (y/x)^3) = (y^2/x^2, y^3/x^3)\\). On \\(C\\), \\(y^2 = x^3\\), so \\(y^2/x^2 = x\\) and \\(y^3/x^3 = y\\). Hence \\(\\varphi \\circ \\psi = \\mathrm{id}\\) on \\(C \\setminus \\{0\\}\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.19</div>
    <div class="env-body">
        <p>A rational map from a smooth variety to a projective variety extends to a morphism in codimension one. In particular, a rational map from a smooth curve to a projective variety is always a morphism (no indeterminacy).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Hierarchy</div>
    <div class="env-body">
        <p>We now have three levels of "sameness" for varieties, from strictest to loosest:</p>
        <ol>
            <li><strong>Isomorphism</strong> (\\(\\cong\\)): identical as varieties. Implies \\(k[V] \\cong k[W]\\).</li>
            <li><strong>Birational equivalence</strong> (\\(\\sim_{\\mathrm{bir}}\\)): identical on dense open subsets. Implies \\(k(V) \\cong k(W)\\).</li>
            <li><strong>Homeomorphism</strong> (Zariski): identical as topological spaces. Far too weak for algebraic purposes.</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rational-map"></div>

<div class="viz-placeholder" data-viz="viz-parametric-curve"></div>
`,
            visualizations: [
                {
                    id: 'viz-rational-map',
                    title: 'Rational Map and Indeterminacy',
                    description: 'The rational map \\((x,y) \\dashrightarrow y/x\\) is undefined along \\(x = 0\\). Points near the indeterminacy locus are mapped to wildly different values depending on the direction of approach. Drag the point to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 200, originY: 180, scale: 40
                        });

                        var drag = viz.addDraggable('pt', 1.5, 1.0, viz.colors.orange, 8, function() { draw(); });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var ctx = viz.ctx;

                            // Shade the indeterminacy locus (y-axis)
                            var sx0 = viz.toScreen(0, 0)[0];
                            ctx.fillStyle = viz.colors.red + '22';
                            ctx.fillRect(sx0 - 3, 0, 6, viz.height);

                            // Draw level curves of y/x = c
                            for (var c = -3; c <= 3; c += 0.5) {
                                if (Math.abs(c) < 0.01) continue;
                                ctx.strokeStyle = viz.colors.teal + '33';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                // y = cx, draw line
                                var x1 = -5, y1 = c * (-5);
                                var x2 = 5, y2 = c * 5;
                                var s1 = viz.toScreen(x1, y1);
                                var s2 = viz.toScreen(x2, y2);
                                ctx.moveTo(s1[0], s1[1]);
                                ctx.lineTo(s2[0], s2[1]);
                                ctx.stroke();
                            }

                            // Draw draggable point and its value
                            var px = drag.x;
                            var py = drag.y;
                            var val = (Math.abs(px) > 0.01) ? (py / px) : undefined;

                            viz.drawDraggables();

                            if (val !== undefined) {
                                viz.screenText('\u03C6(' + px.toFixed(1) + ', ' + py.toFixed(1) + ') = y/x = ' + val.toFixed(2),
                                    viz.width / 2, 20, viz.colors.orange, 12);

                                // Show the level curve through this point
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var lx1 = -5, ly1 = val * (-5);
                                var lx2 = 5, ly2 = val * 5;
                                var ls1 = viz.toScreen(lx1, ly1);
                                var ls2 = viz.toScreen(lx2, ly2);
                                ctx.moveTo(ls1[0], ls1[1]);
                                ctx.lineTo(ls2[0], ls2[1]);
                                ctx.stroke();
                            } else {
                                viz.screenText('\u03C6 is UNDEFINED at x = 0 (indeterminacy)', viz.width / 2, 20, viz.colors.red, 12);
                            }

                            // Legend
                            viz.screenText('\u03C6(x,y) = y/x', viz.width / 2, viz.height - 15, viz.colors.white, 12);
                            viz.screenText('Red strip: x = 0 (indeterminacy locus)', viz.width / 2, viz.height - 35, viz.colors.red, 10);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-parametric-curve',
                    title: 'Parametric Curve: Cuspidal Cubic',
                    description: 'The map \\(t \\mapsto (t^2, t^3)\\) parametrizes the cuspidal cubic \\(y^2 = x^3\\). Watch the point trace out the curve. Notice the cusp at the origin where \\(t = 0\\): the curve "turns back" on itself, creating a singularity.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 180, originY: 220, scale: 60
                        });

                        var tParam = 0;
                        var animating = false;
                        var trailPoints = [];

                        VizEngine.createSlider(controls, 't', -1.5, 1.5, tParam, 0.02, function(v) {
                            tParam = v;
                            trailPoints = [];
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            tParam = -1.5;
                            trailPoints = [];
                            viz.animate(function() {
                                tParam += 0.015;
                                if (tParam > 1.5) {
                                    viz.stopAnimation();
                                    animating = false;
                                    return;
                                }
                                trailPoints.push([tParam * tParam, tParam * tParam * tParam]);
                                draw();
                            });
                        });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Draw the cuspidal cubic y^2 = x^3
                            viz.drawFunction(function(x) { return x >= 0 ? Math.pow(x, 1.5) : undefined; }, -0.5, 3.5, viz.colors.blue + '66', 1.5);
                            viz.drawFunction(function(x) { return x >= 0 ? -Math.pow(x, 1.5) : undefined; }, -0.5, 3.5, viz.colors.blue + '66', 1.5);

                            // Draw trail
                            var ctx = viz.ctx;
                            if (trailPoints.length > 1) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                for (var i = 0; i < trailPoints.length; i++) {
                                    var sp = viz.toScreen(trailPoints[i][0], trailPoints[i][1]);
                                    if (i === 0) ctx.moveTo(sp[0], sp[1]);
                                    else ctx.lineTo(sp[0], sp[1]);
                                }
                                ctx.stroke();
                            }

                            // Current point
                            var cx = tParam * tParam;
                            var cy = tParam * tParam * tParam;
                            viz.drawPoint(cx, cy, viz.colors.orange, null, 7);

                            // Label
                            viz.screenText('t = ' + tParam.toFixed(2) + '  \u21A6  (' + cx.toFixed(2) + ', ' + cy.toFixed(2) + ')',
                                viz.width / 2, 20, viz.colors.orange, 13);
                            viz.screenText('\u03C6(t) = (t\u00B2, t\u00B3)     Curve: y\u00B2 = x\u00B3', viz.width / 2, viz.height - 15, viz.colors.white, 12);

                            // Mark the cusp
                            viz.drawPoint(0, 0, viz.colors.red, 'cusp', 4);

                            // t-axis indicator at bottom
                            var tAxisY = viz.height - 45;
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(80, tAxisY);
                            ctx.lineTo(viz.width - 80, tAxisY);
                            ctx.stroke();

                            var tScreenX = 80 + (tParam + 1.5) / 3.0 * (viz.width - 160);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(tScreenX, tAxisY, 5, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('t-axis (domain A\u00B9)', viz.width / 2, tAxisY + 14, viz.colors.text, 9);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the nodal cubic \\(V(y^2 - x^2(x+1))\\) is birationally equivalent to \\(\\mathbb{A}^1\\) by constructing explicit rational maps in both directions.',
                    hint: 'Try the parametrization from the tangent lines at the node. At the origin, the tangent directions are \\(y = \\pm x\\). Set \\(y = tx\\) and solve for \\(x\\) in terms of \\(t\\).',
                    solution: 'Substituting \\(y = tx\\) into \\(y^2 = x^2(x+1)\\): \\(t^2 x^2 = x^2(x+1)\\), so (for \\(x \\neq 0\\)) \\(x = t^2 - 1\\). Then \\(y = t(t^2-1)\\). The morphism \\(\\psi: \\mathbb{A}^1 \\to C\\) by \\(t \\mapsto (t^2-1, t(t^2-1))\\) and the rational map \\(\\varphi: C \\dashrightarrow \\mathbb{A}^1\\) by \\((x,y) \\mapsto y/x\\) are mutual inverses away from the node. Hence \\(C \\sim_{\\mathrm{bir}} \\mathbb{A}^1\\).'
                },
                {
                    question: 'Let \\(V = V(y^2 - x^3 - x) \\subseteq \\mathbb{A}^2\\) (an elliptic curve, assuming \\(\\mathrm{char}\\, k \\neq 2\\)). Show that \\(V\\) is <em>not</em> birationally equivalent to \\(\\mathbb{A}^1\\).',
                    hint: 'A variety birationally equivalent to \\(\\mathbb{A}^1\\) is called <em>rational</em>. For curves, this is equivalent to having genus 0. The curve \\(y^2 = x^3 + x\\) is smooth and has genus 1.',
                    solution: 'The curve \\(y^2 = x^3 + x\\) is smooth (the discriminant \\(-4(1)^3 - 27(0)^2 = -4 \\neq 0\\) in characteristic \\(\\neq 2\\)). A smooth projective curve of genus \\(g \\geq 1\\) cannot be rational. The genus of a smooth plane cubic is 1 (by the genus formula \\(g = (d-1)(d-2)/2\\) with \\(d = 3\\)). Alternatively: if \\(V \\sim_{\\mathrm{bir}} \\mathbb{A}^1\\), then \\(k(V) \\cong k(t)\\), but \\(k(V) = k(x)[y]/(y^2 - x^3 - x)\\) is a degree-2 extension of \\(k(x)\\) that cannot be purely transcendental.'
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
<h2>The Algebra-Geometry Bridge</h2>

<div class="env-block intuition">
    <div class="env-title">The Dictionary So Far</div>
    <div class="env-body">
        <p>Over the last three chapters, we have built a remarkable dictionary between algebra and geometry:</p>
        <table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:0.9em;">
            <tr style="border-bottom:2px solid var(--border-default);">
                <th style="padding:8px; text-align:left;">Geometry</th>
                <th style="padding:8px; text-align:left;">Algebra</th>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Affine variety \\(V\\)</td>
                <td style="padding:8px;">Finitely generated reduced \\(k\\)-algebra \\(k[V]\\)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Point \\(p \\in V\\)</td>
                <td style="padding:8px;">Maximal ideal \\(\\mathfrak{m}_p \\subseteq k[V]\\)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Subvariety \\(W \\subseteq V\\)</td>
                <td style="padding:8px;">Prime ideal \\(\\mathfrak{p} \\subseteq k[V]\\)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Morphism \\(\\varphi: V \\to W\\)</td>
                <td style="padding:8px;">\\(k\\)-algebra homomorphism \\(\\varphi^*: k[W] \\to k[V]\\)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Isomorphism \\(V \\cong W\\)</td>
                <td style="padding:8px;">\\(k[V] \\cong k[W]\\) as \\(k\\)-algebras</td>
            </tr>
            <tr>
                <td style="padding:8px;">Birational equivalence \\(V \\sim_{\\mathrm{bir}} W\\)</td>
                <td style="padding:8px;">\\(k(V) \\cong k(W)\\) (function fields)</td>
            </tr>
        </table>
        <p>This dictionary is the essence of algebraic geometry: <strong>every geometric question can be translated into an algebraic question, and vice versa</strong>.</p>
    </div>
</div>

<h3>What Comes Next</h3>

<p>In <strong>Chapter 3</strong> we tackle <strong>dimension</strong>: the parabola is a curve (dimension 1), the plane is a surface (dimension 2), but how do we define dimension algebraically? The answer involves chains of prime ideals (Krull dimension), and connects to the transcendence degree of the function field.</p>

<p>In <strong>Chapter 4</strong> we move to <strong>projective space</strong>, which resolves many pathologies of affine geometry. In projective space, parallel lines meet at infinity, every two distinct curves intersect (Bezout's theorem), and the theory of intersections becomes clean and beautiful.</p>

<p>The singularity at the cusp of \\(y^2 = x^3\\) will be resolved in <strong>Chapter 8</strong> via <strong>blowups</strong>, where we replace the offending point by the set of all tangent directions through it.</p>

<div class="viz-placeholder" data-viz="viz-blowup-preview"></div>

<h3>Key Takeaways</h3>

<div class="env-block remark">
    <div class="env-title">Summary</div>
    <div class="env-body">
        <ol>
            <li>A <strong>morphism</strong> of affine varieties is a map defined by polynomials. Morphisms are automatically Zariski continuous, but the converse fails.</li>
            <li>The <strong>pullback</strong> \\(\\varphi^*: k[W] \\to k[V]\\) reverses arrows: geometry forward, algebra backward.</li>
            <li>The pullback gives an <strong>anti-equivalence of categories</strong> between affine varieties and finitely generated reduced \\(k\\)-algebras.</li>
            <li>An <strong>isomorphism</strong> requires a polynomial inverse. Bijective morphisms need not be isomorphisms (cuspidal cubic).</li>
            <li><strong>Rational maps</strong> are defined on dense open subsets. Birational equivalence is the coarser notion where two varieties are "the same" if they agree on a dense open subset.</li>
        </ol>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-blowup-preview',
                    title: 'Preview: Resolving the Node by Blowup',
                    description: 'The nodal cubic \\(y^2 = x^3 + x^2\\) has a self-intersection at the origin. The blowup replaces the origin by the set of tangent directions, separating the two branches. Slide the parameter to see the node open up into a smooth curve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 280, originY: 200, scale: 80
                        });

                        var blowParam = 0;

                        VizEngine.createSlider(controls, 'Blowup', 0, 1, blowParam, 0.01, function(v) {
                            blowParam = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var ctx = viz.ctx;

                            // The nodal cubic: y^2 = x^3 + x^2 = x^2(x+1)
                            // Parametrize: x = t^2 - 1, y = t(t^2 - 1)
                            // Deform toward resolution: separate the node

                            var sep = blowParam * 0.8;

                            // Upper branch
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 300; i++) {
                                var t = -1.5 + 3.0 * i / 300;
                                var x = t * t - 1;
                                var y = t * (t * t - 1);
                                // Apply separation near origin
                                var dist = Math.sqrt(x * x + y * y);
                                var factor = Math.exp(-dist * dist / (0.3 + 0.01));
                                y += sep * factor * (t > 0 ? 1 : -1) * 0.3;
                                x += sep * factor * 0.1;

                                var sp = viz.toScreen(x, y);
                                if (sp[0] < 0 || sp[0] > viz.width || sp[1] < 0 || sp[1] > viz.height) {
                                    started = false;
                                    continue;
                                }
                                if (!started) { ctx.moveTo(sp[0], sp[1]); started = true; }
                                else ctx.lineTo(sp[0], sp[1]);
                            }
                            ctx.stroke();

                            // Node point
                            if (blowParam < 0.5) {
                                var alpha = 1 - blowParam * 2;
                                ctx.globalAlpha = alpha;
                                viz.drawPoint(0, 0, viz.colors.red, blowParam < 0.1 ? 'node' : '', 5);
                                ctx.globalAlpha = 1;
                            }

                            // Labels
                            if (blowParam < 0.1) {
                                viz.screenText('y\u00B2 = x\u00B3 + x\u00B2  (nodal cubic)', viz.width / 2, 20, viz.colors.white, 13);
                            } else if (blowParam > 0.9) {
                                viz.screenText('After blowup: node resolved, curve is smooth', viz.width / 2, 20, viz.colors.teal, 13);
                            } else {
                                viz.screenText('Blowing up the node...', viz.width / 2, 20, viz.colors.orange, 13);
                            }

                            viz.screenText('Blowup parameter: ' + blowParam.toFixed(2), viz.width / 2, viz.height - 15, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that the anti-equivalence sends the identity morphism \\(\\mathrm{id}_V: V \\to V\\) to the identity ring map \\(\\mathrm{id}_{k[V]}: k[V] \\to k[V]\\).',
                    hint: 'What does the pullback of the identity morphism do to a function \\(f \\in k[V]\\)?',
                    solution: '\\(\\mathrm{id}_V^*(f) = f \\circ \\mathrm{id}_V = f\\) for all \\(f \\in k[V]\\). So \\(\\mathrm{id}_V^* = \\mathrm{id}_{k[V]}\\).'
                },
                {
                    question: 'Construct an explicit example of two non-isomorphic affine varieties that are birationally equivalent.',
                    hint: 'We already encountered such a pair in this chapter.',
                    solution: '\\(\\mathbb{A}^1\\) and the cuspidal cubic \\(C = V(y^2 - x^3)\\). They are birationally equivalent via \\(t \\mapsto (t^2, t^3)\\) and \\((x,y) \\mapsto y/x\\). But \\(k[\\mathbb{A}^1] = k[t]\\) while \\(k[C] = k[t^2, t^3] \\subsetneq k[t]\\), so the coordinate rings are not isomorphic, hence the varieties are not isomorphic.'
                }
            ]
        }
    ]
});
