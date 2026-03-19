window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'Projective Space & Projective Varieties',
    subtitle: 'Completing affine space with points at infinity',
    sections: [
        // ================================================================
        // SECTION 1: Why Projective Space?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Projective Space?',
            content: `
<h2>Why Projective Space?</h2>

<div class="env-block intuition">
    <div class="env-title">The Problem with Parallel Lines</div>
    <div class="env-body">
        <p>In Euclidean geometry, parallel lines never meet. But in many algebro-geometric situations, this is an annoyance rather than a feature. Consider two lines in \\(\\mathbb{A}^2\\):</p>
        \\[L_1: y = 2x + 1, \\quad L_2: y = 2x + 3.\\]
        <p>They share no common point. Yet a "generic" pair of lines does intersect in exactly one point. The parallel case is an exception that breaks clean counting theorems.</p>
        <p>Projective space fixes this by adding <strong>points at infinity</strong>, one for each direction. Two parallel lines, sharing the same slope, meet at the point at infinity corresponding to that slope. The result is a space where every pair of distinct lines meets in exactly one point.</p>
    </div>
</div>

<p>The need for projective space arises from several directions at once:</p>

<ol>
    <li><strong>Intersection theory.</strong> In \\(\\mathbb{A}^2\\), a line and a conic can meet in 0, 1, or 2 points. In \\(\\mathbb{P}^2\\), a line and a smooth conic always meet in exactly 2 points (counted with multiplicity). This is B&eacute;zout's theorem in action, and it only works in projective space.</li>
    <li><strong>Compactness.</strong> Affine space \\(\\mathbb{A}^n\\) is not compact (in any reasonable topology). Projective space \\(\\mathbb{P}^n\\) is compact over \\(\\mathbb{R}\\) or \\(\\mathbb{C}\\). Compactness gives us finiteness results and proper maps, which are the algebraic analogue of closed maps.</li>
    <li><strong>Completeness.</strong> A morphism from a projective variety to any variety has closed image (the valuative criterion). Points "do not escape to infinity."</li>
    <li><strong>Uniformity.</strong> Many algebraic statements become cleaner. A degree \\(d\\) curve in \\(\\mathbb{P}^2\\) is cut out by a single homogeneous polynomial of degree \\(d\\). In \\(\\mathbb{A}^2\\), you only see the affine piece, and the global structure is hidden.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Projective geometry originates in Renaissance art. Filippo Brunelleschi (c. 1413) and Leon Battista Alberti developed the theory of perspective projection, where parallel lines in the scene converge to a "vanishing point" on the canvas. Girard Desargues (1639) and Jean-Victor Poncelet (1822) formalized this into projective geometry, recognizing that the vanishing point is a genuine geometric object: a point at infinity.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: A Hyperbola's Missing Points</div>
    <div class="env-body">
        <p>The hyperbola \\(xy = 1\\) in \\(\\mathbb{A}^2\\) has two branches that "go off to infinity." Its projective closure in \\(\\mathbb{P}^2\\) is the curve \\(XY = Z^2\\), which is a smooth conic. The two "missing" points are \\([1:0:0]\\) and \\([0:1:0]\\), lying on the line at infinity \\(Z = 0\\). The projective conic is a complete, closed curve with no gaps.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-parallel-lines-meet"></div>
`,
            visualizations: [
                {
                    id: 'viz-parallel-lines-meet',
                    title: 'Parallel Lines Meet at Infinity',
                    description: 'Two parallel lines in the affine plane, shown with their common "point at infinity." Drag the slope to see how the meeting point changes. As lines become more parallel, their intersection recedes to the horizon.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 280, scale: 40
                        });

                        var slope = 1.0;
                        var intercept1 = -1;
                        var intercept2 = 1.5;
                        var animPhase = 0;
                        var animating = true;

                        VizEngine.createSlider(controls, 'slope', -3, 3, slope, 0.1, function(v) {
                            slope = v;
                        });
                        VizEngine.createSlider(controls, 'gap', 0.5, 4, intercept2 - intercept1, 0.1, function(v) {
                            intercept2 = intercept1 + v;
                        });

                        function draw(t) {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            animPhase = (t || 0) * 0.001;

                            // Draw the two parallel lines
                            var xMin = -8, xMax = 8;
                            viz.drawFunction(function(x) { return slope * x + intercept1; }, xMin, xMax, viz.colors.blue, 2.5);
                            viz.drawFunction(function(x) { return slope * x + intercept2; }, xMin, xMax, viz.colors.teal, 2.5);

                            // Labels
                            viz.drawText('L\u2081', 3, slope * 3 + intercept1 + 0.5, viz.colors.blue, 13);
                            viz.drawText('L\u2082', 3, slope * 3 + intercept2 + 0.5, viz.colors.teal, 13);

                            // Draw direction arrow showing where they "meet"
                            var dirAngle = Math.atan(slope);
                            var arrowLen = 160;
                            var cx = viz.width / 2;
                            var cy = 40;

                            // Pulsing point at infinity indicator
                            var pulse = 0.5 + 0.5 * Math.sin(animPhase * 2);
                            var r = 6 + pulse * 4;

                            // Draw converging arrows from both lines toward the "infinity" point
                            var infX = cx + arrowLen * Math.cos(dirAngle);
                            var infY = cy;

                            ctx.save();
                            ctx.globalAlpha = 0.4 + 0.3 * pulse;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            // From midpoint of L1
                            var mp1 = viz.toScreen(2, slope * 2 + intercept1);
                            ctx.beginPath(); ctx.moveTo(mp1[0], mp1[1]);
                            ctx.lineTo(mp1[0] + 100 * Math.cos(dirAngle), mp1[1] - 100 * Math.sin(dirAngle));
                            ctx.stroke();
                            // From midpoint of L2
                            var mp2 = viz.toScreen(2, slope * 2 + intercept2);
                            ctx.beginPath(); ctx.moveTo(mp2[0], mp2[1]);
                            ctx.lineTo(mp2[0] + 100 * Math.cos(dirAngle), mp2[1] - 100 * Math.sin(dirAngle));
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.restore();

                            // "Point at infinity" indicator at top edge
                            var edgeX = viz.width / 2 + 100 * Math.cos(dirAngle);
                            var edgeY = 30;
                            ctx.fillStyle = viz.colors.orange + '88';
                            ctx.beginPath();
                            ctx.arc(edgeX, edgeY, r, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(edgeX, edgeY, 4, 0, Math.PI * 2);
                            ctx.fill();

                            viz.screenText('Point at \u221e', edgeX, edgeY + 16, viz.colors.orange, 11);
                            viz.screenText('direction [1 : ' + slope.toFixed(1) + ' : 0]', edgeX, edgeY + 30, viz.colors.text, 10);

                            // Title
                            viz.screenText('Parallel lines meet at a point at infinity', viz.width / 2, viz.height - 15, viz.colors.white, 12);
                        }

                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In \\(\\mathbb{A}^2\\), the lines \\(y = 3x + 1\\) and \\(y = 3x - 5\\) are parallel. At which point of \\(\\mathbb{P}^2\\) do their projective closures intersect?',
                    hint: 'Homogenize both equations using \\(x = X/Z, y = Y/Z\\). Set \\(Z = 0\\) and solve.',
                    solution: 'Homogenizing: \\(Y = 3X + Z\\) and \\(Y = 3X - 5Z\\). Setting \\(Z = 0\\): both give \\(Y = 3X\\). In projective coordinates, the intersection is \\([1:3:0]\\), the point at infinity in the direction of slope 3.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Projective Space P^n
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Projective Space P^n',
            content: `
<h2>Projective Space \\(\\mathbb{P}^n\\)</h2>

<div class="env-block intuition">
    <div class="env-title">Lines Through the Origin</div>
    <div class="env-body">
        <p>Projective \\(n\\)-space is the set of all lines through the origin in \\(\\mathbb{A}^{n+1}\\). Each such line is determined by any nonzero point on it, and two nonzero points determine the same line if and only if one is a scalar multiple of the other. So \\(\\mathbb{P}^n\\) is the quotient of \\(\\mathbb{A}^{n+1} \\setminus \\{0\\}\\) by the scaling equivalence.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Projective \\(n\\)-Space)</div>
    <div class="env-body">
        <p>Let \\(k\\) be a field. <strong>Projective \\(n\\)-space</strong> over \\(k\\) is the set</p>
        \\[\\mathbb{P}^n_k = \\bigl(\\mathbb{A}^{n+1}_k \\setminus \\{0\\}\\bigr) \\big/ {\\sim}\\]
        <p>where \\((a_0, \\ldots, a_n) \\sim (\\lambda a_0, \\ldots, \\lambda a_n)\\) for all \\(\\lambda \\in k^*\\). The equivalence class of \\((a_0, \\ldots, a_n)\\) is written \\([a_0 : a_1 : \\cdots : a_n]\\) and called a point of \\(\\mathbb{P}^n\\) in <strong>homogeneous coordinates</strong>.</p>
    </div>
</div>

<p>The key property of homogeneous coordinates is the <strong>scaling equivalence</strong>:</p>
\\[[a_0 : a_1 : \\cdots : a_n] = [\\lambda a_0 : \\lambda a_1 : \\cdots : \\lambda a_n]\\]
<p>for any \\(\\lambda \\neq 0\\). The coordinates are not unique; only their ratios matter.</p>

<div class="env-block example">
    <div class="env-title">Example: The Projective Line \\(\\mathbb{P}^1\\)</div>
    <div class="env-body">
        <p>Points of \\(\\mathbb{P}^1\\) are equivalence classes \\([a : b]\\) with \\((a, b) \\neq (0, 0)\\).</p>
        <ul>
            <li>If \\(b \\neq 0\\), we can normalize to \\([a/b : 1]\\), which corresponds to the point \\(a/b\\) on the affine line. This gives a copy of \\(\\mathbb{A}^1\\) inside \\(\\mathbb{P}^1\\).</li>
            <li>If \\(b = 0\\), then \\(a \\neq 0\\), and we get the single point \\([1 : 0]\\).</li>
        </ul>
        <p>So \\(\\mathbb{P}^1 = \\mathbb{A}^1 \\cup \\{[1:0]\\}\\). The projective line is the affine line plus one "point at infinity." Topologically (over \\(\\mathbb{R}\\)), it is a circle; over \\(\\mathbb{C}\\), it is the Riemann sphere \\(S^2\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Projective Plane \\(\\mathbb{P}^2\\)</div>
    <div class="env-body">
        <p>Points of \\(\\mathbb{P}^2\\) are \\([X : Y : Z]\\). Those with \\(Z \\neq 0\\) correspond to affine points \\((X/Z, Y/Z) \\in \\mathbb{A}^2\\). The remaining points have \\(Z = 0\\), so they are \\([X : Y : 0]\\), forming a copy of \\(\\mathbb{P}^1\\) called the <strong>line at infinity</strong>.</p>
        <p>Thus \\(\\mathbb{P}^2 = \\mathbb{A}^2 \\cup \\mathbb{P}^1\\). The projective plane is the affine plane plus a "line at infinity," and that line itself is a projective line.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 4.1</div>
    <div class="env-body">
        <p>In \\(\\mathbb{P}^2\\), any two distinct lines intersect in exactly one point, and any two distinct points determine exactly one line.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>A line in \\(\\mathbb{P}^2\\) is the vanishing set of a linear form \\(aX + bY + cZ = 0\\). Two distinct lines give a system of two linear equations in three unknowns, which has a one-dimensional solution space (a line through the origin in \\(\\mathbb{A}^3\\)), i.e., exactly one point of \\(\\mathbb{P}^2\\). Dually, two distinct points determine a unique line through them.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-projective-line"></div>

<div class="viz-placeholder" data-viz="viz-homogeneous-coordinates"></div>
`,
            visualizations: [
                {
                    id: 'viz-projective-line',
                    title: 'The Projective Line P\u00B9',
                    description: 'P\u00B9 is the affine line plus one point at infinity. Over the reals, it wraps into a circle. Click on the circle to see the corresponding homogeneous coordinates.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 1
                        });
                        var radius = 120;
                        var selectedAngle = null;

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left - viz.originX;
                            var my = e.clientY - rect.top - viz.originY;
                            var dist = Math.sqrt(mx * mx + my * my);
                            if (Math.abs(dist - radius) < 20) {
                                selectedAngle = Math.atan2(-my, mx);
                                draw();
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = viz.originX, cy = viz.originY;

                            // Title
                            viz.screenText('The Projective Line P\u00B9 as a Circle', viz.width / 2, 25, viz.colors.white, 15);

                            // Draw the circle
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                            ctx.stroke();

                            // Mark the affine part: bottom semicircle is the "visible" A^1
                            // Mark the point at infinity at top
                            var infX = cx, infY = cy - radius;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(infX, infY, 7, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('[1 : 0]  (point at \u221e)', infX + 50, infY - 5, viz.colors.orange, 12);

                            // Mark a few affine points on the circle
                            var affineVals = [-3, -2, -1, 0, 1, 2, 3];
                            for (var i = 0; i < affineVals.length; i++) {
                                var t = affineVals[i];
                                // stereographic: angle = 2 * arctan(t), but we use a simpler projection
                                var angle = 2 * Math.atan(t);
                                var px = cx + radius * Math.cos(Math.PI / 2 - angle);
                                var py = cy - radius * Math.sin(Math.PI / 2 - angle);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(px, py, 4, 0, Math.PI * 2);
                                ctx.fill();
                                var labelOffset = radius + 18;
                                var lx = cx + labelOffset * Math.cos(Math.PI / 2 - angle);
                                var ly = cy - labelOffset * Math.sin(Math.PI / 2 - angle);
                                viz.screenText(t.toString(), lx, ly, viz.colors.text, 10);
                            }

                            // Draw the real line at the bottom for comparison
                            var lineY = cy + radius + 70;
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(40, lineY);
                            ctx.lineTo(viz.width - 40, lineY);
                            ctx.stroke();

                            // Arrow heads
                            ctx.fillStyle = viz.colors.purple;
                            ctx.beginPath();
                            ctx.moveTo(40, lineY); ctx.lineTo(48, lineY - 4); ctx.lineTo(48, lineY + 4); ctx.closePath(); ctx.fill();
                            ctx.beginPath();
                            ctx.moveTo(viz.width - 40, lineY); ctx.lineTo(viz.width - 48, lineY - 4); ctx.lineTo(viz.width - 48, lineY + 4); ctx.closePath(); ctx.fill();

                            viz.screenText('A\u00B9 (affine line)', viz.width / 2, lineY - 14, viz.colors.purple, 11);

                            // Mark same values on the line
                            for (var j = 0; j < affineVals.length; j++) {
                                var val = affineVals[j];
                                var lx2 = cx + val * 35;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(lx2, lineY, 3, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText(val.toString(), lx2, lineY + 14, viz.colors.text, 10);
                            }

                            viz.screenText('\u2212\u221e', 55, lineY + 14, viz.colors.text, 10);
                            viz.screenText('+\u221e', viz.width - 55, lineY + 14, viz.colors.text, 10);

                            // Correspondence arrows
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 0.5;
                            ctx.setLineDash([3, 3]);
                            var angle0 = 2 * Math.atan(0);
                            var p0x = cx + radius * Math.cos(Math.PI / 2 - angle0);
                            var p0y = cy - radius * Math.sin(Math.PI / 2 - angle0);
                            ctx.beginPath(); ctx.moveTo(p0x, p0y); ctx.lineTo(cx, lineY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Selected point info
                            if (selectedAngle !== null) {
                                var spx = cx + radius * Math.cos(selectedAngle);
                                var spy = cy - radius * Math.sin(selectedAngle);

                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath();
                                ctx.arc(spx, spy, 6, 0, Math.PI * 2);
                                ctx.fill();

                                // Compute the affine coordinate
                                var theta = selectedAngle;
                                var tangent = Math.tan((Math.PI / 2 - theta) / 2);

                                if (Math.abs(theta - Math.PI / 2) < 0.1) {
                                    viz.screenText('Selected: [1 : 0] = \u221e', viz.width / 2, viz.height - 20, viz.colors.yellow, 13);
                                } else {
                                    viz.screenText('Selected: [' + tangent.toFixed(2) + ' : 1] \u2194 t = ' + tangent.toFixed(2), viz.width / 2, viz.height - 20, viz.colors.yellow, 13);
                                }
                            }

                            viz.screenText('P\u00B9 = A\u00B9 \u222A {\u221e}', viz.width / 2, viz.height - 45, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-homogeneous-coordinates',
                    title: 'Homogeneous Coordinates: Scaling Equivalence',
                    description: 'Homogeneous coordinates [X:Y:Z] are defined only up to scaling. Drag the slider to scale the representative point and see that all scalar multiples represent the same projective point.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 220, scale: 50
                        });

                        var baseX = 1, baseY = 2, baseZ = 1;
                        var lambda = 1.0;

                        VizEngine.createSlider(controls, '\u03bb (scale)', -3, 3, lambda, 0.1, function(v) {
                            lambda = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'X', -3, 3, baseX, 0.5, function(v) {
                            baseX = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Y', -3, 3, baseY, 0.5, function(v) {
                            baseY = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Homogeneous Coordinates: Scaling Equivalence', viz.width / 2, 20, viz.colors.white, 14);

                            // Draw 2D projection: we show the (X, Y) plane with Z=1 normalization
                            viz.drawGrid();
                            viz.drawAxes();

                            // The "true" projective point [X:Y:Z] with Z=1 normalization
                            if (Math.abs(baseZ) > 0.01) {
                                var normX = baseX / baseZ;
                                var normY = baseY / baseZ;
                                viz.drawPoint(normX, normY, viz.colors.blue, '[' + baseX + ':' + baseY + ':' + baseZ + ']', 7);
                            }

                            // The scaled representative
                            var sX = lambda * baseX;
                            var sY = lambda * baseY;
                            var sZ = lambda * baseZ;

                            // Show the line through origin in (X,Y) space (projection)
                            if (Math.abs(baseX) > 0.01 || Math.abs(baseY) > 0.01) {
                                viz.drawLine(0, 0, baseX, baseY, viz.colors.purple + '44', 1, true);
                            }

                            // Show scaled point
                            if (Math.abs(sZ) > 0.01) {
                                var snX = sX / sZ;
                                var snY = sY / sZ;
                                viz.drawPoint(snX, snY, viz.colors.orange, null, 5);
                            }

                            // Draw multiple representatives along the line through origin in 3D (shown as dots on the 2D line)
                            for (var t = -3; t <= 3; t += 0.5) {
                                if (Math.abs(t) < 0.1) continue;
                                var rx = t * baseX;
                                var ry = t * baseY;
                                var rz = t * baseZ;
                                if (Math.abs(rz) > 0.01) {
                                    var px = rx / rz;
                                    var py = ry / rz;
                                    // All normalize to the same point!
                                    ctx.fillStyle = viz.colors.text + '44';
                                    var sp = viz.toScreen(px, py);
                                    ctx.beginPath();
                                    ctx.arc(sp[0], sp[1], 2, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Info box
                            var bx = 20, by = viz.height - 90;
                            ctx.fillStyle = '#1a1a40cc';
                            ctx.fillRect(bx, by, 520, 75);

                            viz.screenText('Base point: [' + baseX.toFixed(1) + ' : ' + baseY.toFixed(1) + ' : ' + baseZ.toFixed(1) + ']', bx + 260, by + 15, viz.colors.blue, 12);
                            viz.screenText('\u03bb = ' + lambda.toFixed(1) + ':  [' + sX.toFixed(1) + ' : ' + sY.toFixed(1) + ' : ' + sZ.toFixed(1) + ']', bx + 260, by + 35, viz.colors.orange, 12);

                            if (Math.abs(sZ) > 0.01) {
                                viz.screenText('Normalized: (' + (sX/sZ).toFixed(2) + ', ' + (sY/sZ).toFixed(2) + ')  \u2014 same affine point!', bx + 260, by + 55, viz.colors.teal, 12);
                            } else {
                                viz.screenText('Z = 0: this is a point at infinity', bx + 260, by + 55, viz.colors.orange, 12);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\([2:4:6]\\), \\([1:2:3]\\), and \\([-3:-6:-9]\\) all represent the same point of \\(\\mathbb{P}^2\\).',
                    hint: 'Find the scalar \\(\\lambda\\) relating each pair.',
                    solution: '\\([2:4:6] = 2 \\cdot [1:2:3]\\) (take \\(\\lambda = 2\\)) and \\([-3:-6:-9] = -3 \\cdot [1:2:3]\\) (take \\(\\lambda = -3\\)). Since homogeneous coordinates are equivalent under nonzero scaling, all three represent the same point.'
                },
                {
                    question: 'How many points does \\(\\mathbb{P}^n\\) over the finite field \\(\\mathbb{F}_q\\) have?',
                    hint: 'Count the nonzero vectors in \\(\\mathbb{F}_q^{n+1}\\) and divide by the equivalence: each line through the origin has \\(q - 1\\) nonzero points.',
                    solution: '\\(|\\mathbb{P}^n(\\mathbb{F}_q)| = \\frac{q^{n+1} - 1}{q - 1} = 1 + q + q^2 + \\cdots + q^n\\). For example, \\(|\\mathbb{P}^2(\\mathbb{F}_2)| = 7\\), the Fano plane.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Affine Charts
        // ================================================================
        {
            id: 'sec-charts',
            title: 'Affine Charts',
            content: `
<h2>Affine Charts</h2>

<div class="env-block intuition">
    <div class="env-title">Covering by Open Sets</div>
    <div class="env-body">
        <p>Projective space is not itself an affine variety, but it can be <strong>covered</strong> by affine pieces. Each piece is obtained by "setting one coordinate to 1," which eliminates the scaling ambiguity. The transition between pieces is given by rational functions.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Standard Affine Charts)</div>
    <div class="env-body">
        <p>For \\(i = 0, 1, \\ldots, n\\), define the <strong>\\(i\\)-th standard affine chart</strong> of \\(\\mathbb{P}^n\\) by</p>
        \\[U_i = \\{[a_0 : \\cdots : a_n] \\in \\mathbb{P}^n : a_i \\neq 0\\}.\\]
        <p>There is an isomorphism \\(\\varphi_i : U_i \\to \\mathbb{A}^n\\) given by</p>
        \\[\\varphi_i([a_0 : \\cdots : a_n]) = \\left(\\frac{a_0}{a_i}, \\ldots, \\widehat{\\frac{a_i}{a_i}}, \\ldots, \\frac{a_n}{a_i}\\right)\\]
        <p>where the hat means we omit the \\(i\\)-th entry (which would be 1).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 4.2</div>
    <div class="env-body">
        <p>The standard affine charts cover \\(\\mathbb{P}^n\\):</p>
        \\[\\mathbb{P}^n = U_0 \\cup U_1 \\cup \\cdots \\cup U_n.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>If \\([a_0 : \\cdots : a_n] \\in \\mathbb{P}^n\\), then at least one \\(a_i \\neq 0\\) (since the point is not the origin). Hence the point lies in \\(U_i\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Charts on \\(\\mathbb{P}^2\\)</div>
    <div class="env-body">
        <p>\\(\\mathbb{P}^2\\) has three charts:</p>
        <ul>
            <li>\\(U_0 = \\{X \\neq 0\\}\\): setting \\(X = 1\\), affine coordinates \\((y, z) = (Y/X, Z/X)\\).</li>
            <li>\\(U_1 = \\{Y \\neq 0\\}\\): setting \\(Y = 1\\), affine coordinates \\((x, z) = (X/Y, Z/Y)\\).</li>
            <li>\\(U_2 = \\{Z \\neq 0\\}\\): setting \\(Z = 1\\), affine coordinates \\((x, y) = (X/Z, Y/Z)\\). This is the "standard" chart; points at infinity are those in \\(\\mathbb{P}^2 \\setminus U_2\\).</li>
        </ul>
        <p>The <strong>transition map</strong> from \\(U_2\\) to \\(U_0\\) (on their overlap, where both \\(X \\neq 0\\) and \\(Z \\neq 0\\)) is:</p>
        \\[(x, y) \\mapsto (y', z') = (Y/X, Z/X) = (y/x, 1/x).\\]
        <p>This is a rational map, defined away from \\(x = 0\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-projective-plane"></div>
`,
            visualizations: [
                {
                    id: 'viz-projective-plane',
                    title: 'P\u00B2: Three Affine Charts',
                    description: 'The projective plane P\u00B2 is covered by three affine charts U\u2080, U\u2081, U\u2082. Click on each chart to highlight it and see what part of P\u00B2 it covers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var activeChart = 2;

                        VizEngine.createButton(controls, 'U\u2080 (X\u22600)', function() { activeChart = 0; draw(); });
                        VizEngine.createButton(controls, 'U\u2081 (Y\u22600)', function() { activeChart = 1; draw(); });
                        VizEngine.createButton(controls, 'U\u2082 (Z\u22600)', function() { activeChart = 2; draw(); });

                        var chartColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange];
                        var chartNames = ['U\u2080: X \u2260 0', 'U\u2081: Y \u2260 0', 'U\u2082: Z \u2260 0'];
                        var chartDescs = [
                            'Affine coords (Y/X, Z/X)',
                            'Affine coords (X/Y, Z/Y)',
                            'Affine coords (X/Z, Y/Z)  [standard]'
                        ];
                        var missingDescs = [
                            'Missing: {X = 0} \u2229 P\u00B2 (a copy of P\u00B9)',
                            'Missing: {Y = 0} \u2229 P\u00B2 (a copy of P\u00B9)',
                            'Missing: {Z = 0} \u2229 P\u00B2 (the line at \u221e)'
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = viz.width / 2, cy = viz.height / 2 - 10;

                            viz.screenText('P\u00B2 Covered by Three Affine Charts', cx, 22, viz.colors.white, 15);

                            // Draw a schematic of P^2 as a triangle (representing the three coordinate hyperplanes)
                            var R = 130;
                            var verts = [];
                            for (var i = 0; i < 3; i++) {
                                var angle = -Math.PI / 2 + i * 2 * Math.PI / 3;
                                verts.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
                            }

                            // Fill the triangle representing the full P^2
                            ctx.fillStyle = '#1a1a4088';
                            ctx.beginPath();
                            ctx.moveTo(verts[0][0], verts[0][1]);
                            ctx.lineTo(verts[1][0], verts[1][1]);
                            ctx.lineTo(verts[2][0], verts[2][1]);
                            ctx.closePath();
                            ctx.fill();

                            // Highlight the active chart region
                            // Each chart U_i misses the opposite edge
                            ctx.fillStyle = chartColors[activeChart] + '44';
                            ctx.beginPath();
                            ctx.moveTo(verts[0][0], verts[0][1]);
                            ctx.lineTo(verts[1][0], verts[1][1]);
                            ctx.lineTo(verts[2][0], verts[2][1]);
                            ctx.closePath();
                            ctx.fill();

                            // Draw the three edges (coordinate hyperplanes)
                            var edgeLabels = ['{X=0}', '{Y=0}', '{Z=0}'];
                            for (var e = 0; e < 3; e++) {
                                var v1 = verts[(e + 1) % 3];
                                var v2 = verts[(e + 2) % 3];
                                var isMissing = (e === activeChart);

                                ctx.strokeStyle = isMissing ? viz.colors.red : viz.colors.text + '66';
                                ctx.lineWidth = isMissing ? 3 : 1.5;
                                if (isMissing) ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.moveTo(v1[0], v1[1]);
                                ctx.lineTo(v2[0], v2[1]);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Edge label
                                var emx = (v1[0] + v2[0]) / 2;
                                var emy = (v1[1] + v2[1]) / 2;
                                var dx = emx - cx, dy = emy - cy;
                                var dl = Math.sqrt(dx * dx + dy * dy);
                                viz.screenText(edgeLabels[e], emx + dx / dl * 22, emy + dy / dl * 22,
                                    isMissing ? viz.colors.red : viz.colors.text, 11);
                            }

                            // Vertex labels
                            var vertLabels = ['[0:0:1]', '[0:1:0]', '[1:0:0]'];
                            for (var vi = 0; vi < 3; vi++) {
                                var vx = verts[vi][0], vy = verts[vi][1];
                                var ddx = vx - cx, ddy = vy - cy;
                                var ddl = Math.sqrt(ddx * ddx + ddy * ddy);
                                ctx.fillStyle = viz.colors.white;
                                ctx.beginPath();
                                ctx.arc(vx, vy, 4, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText(vertLabels[vi], vx + ddx / ddl * 30, vy + ddy / ddl * 25, viz.colors.white, 10);
                            }

                            // Info panel
                            var panelY = cy + R + 40;
                            viz.screenText('Active chart: ' + chartNames[activeChart], cx, panelY, chartColors[activeChart], 14);
                            viz.screenText(chartDescs[activeChart], cx, panelY + 22, viz.colors.text, 12);
                            viz.screenText(missingDescs[activeChart], cx, panelY + 42, viz.colors.red, 11);
                            viz.screenText('P\u00B2 = U\u2080 \u222A U\u2081 \u222A U\u2082', cx, panelY + 65, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the transition map from the chart \\(U_2\\) (coordinates \\((x,y) = (X/Z, Y/Z)\\)) to the chart \\(U_1\\) (coordinates \\((u,v) = (X/Y, Z/Y)\\)) on their overlap \\(U_1 \\cap U_2\\).',
                    hint: 'Express \\(u\\) and \\(v\\) in terms of \\(x\\) and \\(y\\) using \\(X = xZ\\), \\(Y = yZ\\).',
                    solution: 'On \\(U_2\\), the point is \\([x : y : 1]\\). In \\(U_1\\) coordinates: \\(u = X/Y = x/y\\) and \\(v = Z/Y = 1/y\\). So the transition map is \\((x,y) \\mapsto (x/y, 1/y)\\), defined where \\(y \\neq 0\\).'
                },
                {
                    question: 'Show that no single affine chart covers all of \\(\\mathbb{P}^n\\). Why do we need at least \\(n+1\\) charts?',
                    hint: 'Each \\(U_i\\) misses the hyperplane \\(\\{a_i = 0\\}\\), which is itself a copy of \\(\\mathbb{P}^{n-1}\\).',
                    solution: 'The chart \\(U_i\\) misses all points with \\(a_i = 0\\). For any point \\([a_0:\\cdots:a_n]\\), at least one coordinate is nonzero, so at least one chart contains it. But no single chart contains, for instance, both \\([1:0:\\cdots:0]\\) (in \\(U_0\\) but not in \\(U_1\\) if the second coordinate is 0) and all other points. We need \\(n+1\\) charts because there are \\(n+1\\) coordinate hyperplanes to cover.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Projective Varieties
        // ================================================================
        {
            id: 'sec-projective-varieties',
            title: 'Projective Varieties',
            content: `
<h2>Projective Varieties</h2>

<div class="env-block intuition">
    <div class="env-title">Why Homogeneous Polynomials?</div>
    <div class="env-body">
        <p>Can we define the "zero set" of a polynomial in projective space? If \\(f\\) is a polynomial and we evaluate \\(f(\\lambda a_0, \\ldots, \\lambda a_n)\\), we get a different value for each \\(\\lambda\\). So \\(f(P) = 0\\) is not well-defined for a projective point \\(P\\).</p>
        <p>But if \\(f\\) is <strong>homogeneous</strong> of degree \\(d\\), then \\(f(\\lambda a_0, \\ldots, \\lambda a_n) = \\lambda^d f(a_0, \\ldots, a_n)\\). So \\(f = 0\\) at one representative if and only if \\(f = 0\\) at all representatives. The vanishing locus of a homogeneous polynomial is well-defined in \\(\\mathbb{P}^n\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Homogeneous Polynomial)</div>
    <div class="env-body">
        <p>A polynomial \\(f \\in k[X_0, \\ldots, X_n]\\) is <strong>homogeneous of degree \\(d\\)</strong> if every monomial in \\(f\\) has total degree \\(d\\). Equivalently,</p>
        \\[f(\\lambda X_0, \\ldots, \\lambda X_n) = \\lambda^d f(X_0, \\ldots, X_n) \\quad \\text{for all } \\lambda \\in k.\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Projective Algebraic Set)</div>
    <div class="env-body">
        <p>Given homogeneous polynomials \\(f_1, \\ldots, f_r \\in k[X_0, \\ldots, X_n]\\), the <strong>projective algebraic set</strong> (or projective variety) they define is</p>
        \\[V(f_1, \\ldots, f_r) = \\{[a_0 : \\cdots : a_n] \\in \\mathbb{P}^n : f_i(a_0, \\ldots, a_n) = 0 \\text{ for all } i\\}.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Projective Conics</div>
    <div class="env-body">
        <p>A conic in \\(\\mathbb{P}^2\\) is \\(V(F)\\) where \\(F = aX^2 + bXY + cY^2 + dXZ + eYZ + fZ^2\\) is a homogeneous quadratic. Setting \\(Z = 1\\) recovers the familiar affine conic. The projective version "fills in" the points at infinity.</p>
        <p>For instance, \\(X^2 + Y^2 = Z^2\\) is the projective circle. In the affine chart \\(Z = 1\\), it is \\(x^2 + y^2 = 1\\). The points at infinity satisfy \\(X^2 + Y^2 = 0\\); over \\(\\mathbb{R}\\) there are none, but over \\(\\mathbb{C}\\) there are two: \\([1:i:0]\\) and \\([1:-i:0]\\), the "circular points at infinity."</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 4.3</div>
    <div class="env-body">
        <p>The projective algebraic sets in \\(\\mathbb{P}^n\\) satisfy the axioms for closed sets of a topology (the <strong>Zariski topology</strong> on \\(\\mathbb{P}^n\\)):</p>
        <ol>
            <li>\\(\\emptyset\\) and \\(\\mathbb{P}^n\\) are projective algebraic sets.</li>
            <li>Arbitrary intersections of projective algebraic sets are projective algebraic sets.</li>
            <li>Finite unions of projective algebraic sets are projective algebraic sets.</li>
        </ol>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Graded Ring Structure</div>
    <div class="env-body">
        <p>The polynomial ring \\(S = k[X_0, \\ldots, X_n]\\) is <strong>graded</strong>: it decomposes as \\(S = \\bigoplus_{d \\geq 0} S_d\\), where \\(S_d\\) is the vector space of homogeneous polynomials of degree \\(d\\). An ideal \\(I \\subset S\\) is <strong>homogeneous</strong> if it is generated by homogeneous elements, equivalently if \\(I = \\bigoplus_{d \\geq 0} (I \\cap S_d)\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-projective-conic"></div>
`,
            visualizations: [
                {
                    id: 'viz-projective-conic',
                    title: 'Conics in P\u00B2: Always Smooth (if Nondegenerate)',
                    description: 'A nondegenerate conic in P\u00B2 is always a smooth curve. Compare the affine piece (which may be an ellipse, parabola, or hyperbola) with the full projective conic. Adjust coefficients to see different types.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 40
                        });

                        var conicType = 'ellipse';

                        VizEngine.createButton(controls, 'Ellipse', function() { conicType = 'ellipse'; draw(); });
                        VizEngine.createButton(controls, 'Parabola', function() { conicType = 'parabola'; draw(); });
                        VizEngine.createButton(controls, 'Hyperbola', function() { conicType = 'hyperbola'; draw(); });

                        function draw() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            viz.screenText('Projective Conic: Affine Piece', viz.width / 2, 20, viz.colors.white, 14);

                            var xMin = -7, xMax = 7;
                            var steps = 500;

                            if (conicType === 'ellipse') {
                                // x^2 + 2y^2 = 1  ->  X^2 + 2Y^2 = Z^2
                                for (var s = 0; s < steps; s++) {
                                    var t = s / steps * Math.PI * 2;
                                    var x = Math.cos(t);
                                    var y = Math.sin(t) / Math.sqrt(2);
                                    var sp = viz.toScreen(x, y);
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.fillRect(sp[0], sp[1], 2, 2);
                                }
                                viz.screenText('x\u00B2 + 2y\u00B2 = 1', viz.width / 2, 40, viz.colors.blue, 12);
                                viz.screenText('Projective: X\u00B2 + 2Y\u00B2 = Z\u00B2', viz.width / 2, 56, viz.colors.teal, 11);
                                viz.screenText('Points at \u221e: X\u00B2 + 2Y\u00B2 = 0 (none over \u211D)', viz.width / 2, viz.height - 35, viz.colors.orange, 11);
                                viz.screenText('Affine piece = entire conic (closed curve)', viz.width / 2, viz.height - 18, viz.colors.text, 11);
                            } else if (conicType === 'parabola') {
                                // y = x^2  ->  YZ = X^2
                                viz.drawFunction(function(x) { return x * x; }, -3, 3, viz.colors.blue, 2.5);
                                viz.screenText('y = x\u00B2', viz.width / 2, 40, viz.colors.blue, 12);
                                viz.screenText('Projective: YZ = X\u00B2', viz.width / 2, 56, viz.colors.teal, 11);
                                viz.screenText('Point at \u221e: [0:1:0] (tangent to line at \u221e)', viz.width / 2, viz.height - 35, viz.colors.orange, 11);
                                // Mark the point at infinity direction
                                ctx.strokeStyle = viz.colors.orange + '66';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                var top = viz.toScreen(0, 5);
                                ctx.beginPath();
                                ctx.moveTo(top[0], top[1]);
                                ctx.lineTo(top[0], 0);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('\u2191 [0:1:0]', top[0] + 25, 15, viz.colors.orange, 10);
                                viz.screenText('Affine piece misses 1 point', viz.width / 2, viz.height - 18, viz.colors.text, 11);
                            } else {
                                // xy = 1  ->  XY = Z^2
                                viz.drawFunction(function(x) { return x > 0.05 ? 1 / x : NaN; }, 0.05, 7, viz.colors.blue, 2.5);
                                viz.drawFunction(function(x) { return x < -0.05 ? 1 / x : NaN; }, -7, -0.05, viz.colors.blue, 2.5);
                                viz.screenText('xy = 1', viz.width / 2, 40, viz.colors.blue, 12);
                                viz.screenText('Projective: XY = Z\u00B2', viz.width / 2, 56, viz.colors.teal, 11);

                                // Mark points at infinity
                                viz.screenText('Points at \u221e: [1:0:0] and [0:1:0]', viz.width / 2, viz.height - 35, viz.colors.orange, 11);
                                // Arrows toward axes
                                ctx.strokeStyle = viz.colors.orange + '66';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                var right = viz.toScreen(6, 0);
                                ctx.beginPath(); ctx.moveTo(right[0], right[1]); ctx.lineTo(viz.width, right[1]); ctx.stroke();
                                var up = viz.toScreen(0, 4);
                                ctx.beginPath(); ctx.moveTo(up[0], up[1]); ctx.lineTo(up[0], 0); ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('[1:0:0] \u2192', viz.width - 50, right[1] - 12, viz.colors.orange, 10);
                                viz.screenText('\u2191 [0:1:0]', up[0] + 25, 15, viz.colors.orange, 10);
                                viz.screenText('Affine piece misses 2 points; projective conic is smooth and closed', viz.width / 2, viz.height - 18, viz.colors.text, 10);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(f = X^2 + Y^2 - Z^2\\) is homogeneous. Find all points of \\(V(f)\\) on the line at infinity (\\(Z = 0\\)) over (a) \\(\\mathbb{R}\\) and (b) \\(\\mathbb{C}\\).',
                    hint: 'Setting \\(Z = 0\\), solve \\(X^2 + Y^2 = 0\\). Over \\(\\mathbb{R}\\), this forces \\(X = Y = 0\\), which is not allowed in projective space.',
                    solution: '\\(f\\) is homogeneous of degree 2 (every term has total degree 2). At infinity (\\(Z=0\\)): \\(X^2 + Y^2 = 0\\). (a) Over \\(\\mathbb{R}\\), \\(X^2 + Y^2 = 0\\) implies \\(X = Y = 0\\), not a projective point, so no real points at infinity. (b) Over \\(\\mathbb{C}\\), \\(X^2 = -Y^2\\), so \\(X = \\pm iY\\), giving \\([1:i:0]\\) and \\([1:-i:0]\\), the circular points at infinity.'
                },
                {
                    question: 'Show that if \\(f\\) is not homogeneous, then \\(V(f)\\) is not well-defined in \\(\\mathbb{P}^n\\). Give a concrete example.',
                    hint: 'Take \\(f = X + 1\\). Does the point \\([1:-1]\\) of \\(\\mathbb{P}^1\\) satisfy \\(f = 0\\)?',
                    solution: 'Consider \\(f = X + 1\\) on \\(\\mathbb{P}^1\\). The point \\([1:-1]\\) gives \\(f(1,-1) = 1 + 1 = 2 \\neq 0\\). But the same point is \\([-1:1]\\), giving \\(f(-1,1) = -1 + 1 = 0\\). So \\(f = 0\\) depends on the choice of representative, and \\(V(f)\\) is not well-defined. This is because \\(f(\\lambda X, \\lambda Y) = \\lambda X + 1 \\neq \\lambda(X + 1)\\) in general.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Homogeneous Coordinate Ring
        // ================================================================
        {
            id: 'sec-homogeneous',
            title: 'The Homogeneous Coordinate Ring',
            content: `
<h2>The Homogeneous Coordinate Ring</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Homogeneous Ideal)</div>
    <div class="env-body">
        <p>An ideal \\(I \\subset S = k[X_0, \\ldots, X_n]\\) is <strong>homogeneous</strong> if it can be generated by homogeneous polynomials. Equivalently, \\(f \\in I\\) implies each homogeneous component of \\(f\\) is in \\(I\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Homogeneous Coordinate Ring)</div>
    <div class="env-body">
        <p>If \\(Y = V(I) \\subset \\mathbb{P}^n\\) is a projective variety defined by a homogeneous ideal \\(I\\), the <strong>homogeneous coordinate ring</strong> of \\(Y\\) is the graded ring</p>
        \\[S(Y) = k[X_0, \\ldots, X_n] / I(Y)\\]
        <p>where \\(I(Y)\\) is the (homogeneous) ideal of all homogeneous polynomials vanishing on \\(Y\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Comparison with Affine Case</div>
    <div class="env-body">
        <p>The homogeneous coordinate ring \\(S(Y)\\) is the projective analogue of the affine coordinate ring \\(k[V] = k[x_1,\\ldots,x_n]/I(V)\\). But there is an important difference: elements of \\(S(Y)\\) do not define <em>functions</em> on \\(Y\\). A homogeneous polynomial \\(f \\in S_d\\) satisfies \\(f(\\lambda P) = \\lambda^d f(P)\\), so its value depends on the representative. However, the <em>ratio</em> \\(f/g\\) of two homogeneous polynomials of the same degree is well-defined on \\(Y\\) (where \\(g \\neq 0\\)).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Projective Nullstellensatz)</div>
    <div class="env-body">
        <p>The <strong>irrelevant ideal</strong> is \\(S_+ = (X_0, \\ldots, X_n) = \\bigoplus_{d > 0} S_d\\). Its vanishing locus is the empty set in \\(\\mathbb{P}^n\\) (the only common zero of all \\(X_i\\) is the origin, which is not in \\(\\mathbb{P}^n\\)).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.4 (Projective Nullstellensatz)</div>
    <div class="env-body">
        <p>Let \\(I \\subset S\\) be a homogeneous ideal. Then:</p>
        <ol>
            <li>\\(V(I) = \\emptyset\\) in \\(\\mathbb{P}^n\\) if and only if \\(\\sqrt{I} \\supseteq S_+\\) (i.e., for each \\(i\\), some power \\(X_i^{N_i} \\in I\\)).</li>
            <li>If \\(V(I) \\neq \\emptyset\\), then \\(I(V(I)) = \\sqrt{I}\\), where the radical is taken in the graded sense.</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Twisted Cubic</div>
    <div class="env-body">
        <p>The <strong>twisted cubic</strong> is the image of \\(\\mathbb{P}^1 \\to \\mathbb{P}^3\\) given by \\([s:t] \\mapsto [s^3 : s^2 t : st^2 : t^3]\\). Its homogeneous ideal in \\(k[X_0, X_1, X_2, X_3]\\) is generated by the \\(2 \\times 2\\) minors of the matrix</p>
        \\[\\begin{pmatrix} X_0 & X_1 & X_2 \\\\ X_1 & X_2 & X_3 \\end{pmatrix}:\\]
        <p>\\(X_0 X_2 - X_1^2, \\; X_0 X_3 - X_1 X_2, \\; X_1 X_3 - X_2^2.\\)</p>
        <p>The homogeneous coordinate ring is \\(S(C) = k[X_0,X_1,X_2,X_3]/(X_0X_2 - X_1^2, X_0X_3 - X_1X_2, X_1X_3 - X_2^2)\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Hilbert Function</div>
    <div class="env-body">
        <p>Since \\(S(Y) = \\bigoplus_{d \\geq 0} S(Y)_d\\) is graded, we can study the <strong>Hilbert function</strong> \\(H_Y(d) = \\dim_k S(Y)_d\\). For \\(d \\gg 0\\), \\(H_Y(d)\\) agrees with a polynomial in \\(d\\) (the Hilbert polynomial), whose degree equals the dimension of \\(Y\\) and whose leading coefficient encodes the degree.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute the Hilbert function \\(H(d) = \\dim_k S_d\\) for \\(S = k[X, Y, Z]\\) (i.e., for \\(\\mathbb{P}^2\\) itself, with no ideal). What is the Hilbert polynomial?',
                    hint: 'The number of monomials of degree \\(d\\) in 3 variables is \\(\\binom{d+2}{2}\\).',
                    solution: '\\(H(d) = \\binom{d+2}{2} = \\frac{(d+1)(d+2)}{2}\\). This is already a polynomial in \\(d\\), so the Hilbert polynomial is \\(P(d) = \\frac{d^2 + 3d + 2}{2}\\). Its degree is 2 = dim(\\(\\mathbb{P}^2\\)), and the leading coefficient \\(1/2\\) gives degree 1 (since degree = \\(2! \\cdot \\text{leading coeff}\\) = 1).'
                },
                {
                    question: 'Let \\(C = V(F) \\subset \\mathbb{P}^2\\) be a curve of degree \\(d\\). Show that the Hilbert function of \\(S(C)\\) is \\(H_C(n) = \\binom{n+2}{2} - \\binom{n-d+2}{2}\\) for \\(n \\geq d\\), and find the Hilbert polynomial.',
                    hint: 'The short exact sequence \\(0 \\to S(-d) \\xrightarrow{\\cdot F} S \\to S/(F) \\to 0\\) gives \\(H_C(n) = H_{\\mathbb{P}^2}(n) - H_{\\mathbb{P}^2}(n-d)\\).',
                    solution: 'Multiplication by \\(F\\) shifts degrees by \\(d\\), giving \\(H_C(n) = \\binom{n+2}{2} - \\binom{n-d+2}{2}\\) for \\(n \\geq d\\). Expanding: \\(P_C(n) = dn - \\frac{d(d-3)}{2}\\). This is a degree 1 polynomial, confirming \\(C\\) is a curve (dimension 1). The leading coefficient \\(d\\) is the degree of \\(C\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Projective Closure
        // ================================================================
        {
            id: 'sec-projective-closure',
            title: 'Projective Closure',
            content: `
<h2>Projective Closure</h2>

<div class="env-block intuition">
    <div class="env-title">Completing Affine Curves</div>
    <div class="env-body">
        <p>Given an affine variety \\(V \\subset \\mathbb{A}^n\\), we can "close it up" in \\(\\mathbb{P}^n\\) by adding points at infinity. This process, called <strong>projective closure</strong>, takes an affine polynomial and <em>homogenizes</em> it, then looks at the resulting projective variety.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Homogenization and Dehomogenization)</div>
    <div class="env-body">
        <p>Let \\(f \\in k[x_1, \\ldots, x_n]\\) have degree \\(d\\). The <strong>homogenization</strong> of \\(f\\) with respect to a new variable \\(X_0\\) is</p>
        \\[f^h(X_0, X_1, \\ldots, X_n) = X_0^d \\cdot f\\left(\\frac{X_1}{X_0}, \\ldots, \\frac{X_n}{X_0}\\right).\\]
        <p>This is homogeneous of degree \\(d\\). Conversely, given a homogeneous \\(F \\in k[X_0, \\ldots, X_n]\\), the <strong>dehomogenization</strong> with respect to \\(X_0\\) is \\(F(1, x_1, \\ldots, x_n)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Homogenizing \\(y = x^2\\)</div>
    <div class="env-body">
        <p>Take \\(f = y - x^2\\), degree \\(d = 2\\). Then</p>
        \\[f^h = Z^2 \\cdot \\left(\\frac{Y}{Z} - \\frac{X^2}{Z^2}\\right) = YZ - X^2.\\]
        <p>The projective curve \\(V(YZ - X^2) \\subset \\mathbb{P}^2\\) is the projective closure of the parabola. Setting \\(Z = 0\\): \\(-X^2 = 0\\), so \\(X = 0\\), giving the single point \\([0:1:0]\\). The parabola gains one point at infinity.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Homogenizing \\(xy = 1\\)</div>
    <div class="env-body">
        <p>Take \\(f = xy - 1\\), degree \\(d = 2\\). Then \\(f^h = XY - Z^2\\). Setting \\(Z = 0\\): \\(XY = 0\\), so \\(X = 0\\) or \\(Y = 0\\), giving \\([0:1:0]\\) and \\([1:0:0]\\). The hyperbola gains two points at infinity, one for each asymptotic direction.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Projective Closure)</div>
    <div class="env-body">
        <p>Let \\(V \\subset \\mathbb{A}^n\\) be an affine variety. Embed \\(\\mathbb{A}^n\\) into \\(\\mathbb{P}^n\\) via \\((a_1, \\ldots, a_n) \\mapsto [1 : a_1 : \\cdots : a_n]\\). The <strong>projective closure</strong> \\(\\overline{V}\\) of \\(V\\) is the closure of the image of \\(V\\) in \\(\\mathbb{P}^n\\) (in the Zariski topology).</p>
        <p>For a hypersurface \\(V = V(f) \\subset \\mathbb{A}^n\\), \\(\\overline{V} = V(f^h) \\subset \\mathbb{P}^n\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Warning: Ideals and Homogenization</div>
    <div class="env-body">
        <p>For varieties defined by more than one equation, the projective closure is <em>not</em> simply obtained by homogenizing each generator. If \\(I = (f_1, \\ldots, f_r)\\), then \\(V(f_1^h, \\ldots, f_r^h) \\supseteq \\overline{V(I)}\\) but equality may fail. One must homogenize the entire ideal (e.g., by computing a Gr&ouml;bner basis with a suitable term order).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-projective-closure-demo"></div>
`,
            visualizations: [
                {
                    id: 'viz-projective-closure-demo',
                    title: 'Projective Closure: Adding Points at Infinity',
                    description: 'Watch an affine curve get "completed" by adding its points at infinity. The animation shows the affine curve growing outward and meeting the line at infinity.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 40
                        });

                        var curveType = 'parabola';
                        var animPhase = 0;

                        VizEngine.createButton(controls, 'Parabola y=x\u00B2', function() { curveType = 'parabola'; });
                        VizEngine.createButton(controls, 'Hyperbola xy=1', function() { curveType = 'hyperbola'; });
                        VizEngine.createButton(controls, 'Cubic y\u00B2=x\u00B3-x', function() { curveType = 'cubic'; });

                        function draw(t) {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();
                            var ctx = viz.ctx;
                            animPhase = (t || 0) * 0.001;

                            // Draw the "line at infinity" as a circle at the boundary
                            var R = Math.min(viz.width, viz.height) / 2 - 10;
                            ctx.strokeStyle = viz.colors.orange + '44';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.arc(viz.originX, viz.originY, R, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            viz.screenText('line at \u221e', viz.originX + R - 45, viz.originY - R + 15, viz.colors.orange, 10);

                            if (curveType === 'parabola') {
                                viz.drawFunction(function(x) { return x * x; }, -4, 4, viz.colors.blue, 2.5);
                                viz.screenText('y = x\u00B2  \u2192  YZ = X\u00B2', viz.width / 2, 20, viz.colors.white, 13);

                                // Point at infinity
                                var pulse = 0.5 + 0.5 * Math.sin(animPhase * 3);
                                var pR = 5 + pulse * 3;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(viz.originX, viz.originY - R, pR, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('[0:1:0]', viz.originX + 20, viz.originY - R - 5, viz.colors.orange, 11);
                                viz.screenText('+1 point at \u221e', viz.width / 2, viz.height - 15, viz.colors.teal, 12);
                            } else if (curveType === 'hyperbola') {
                                viz.drawFunction(function(x) { return x > 0.1 ? 1/x : NaN; }, 0.1, 7, viz.colors.blue, 2.5);
                                viz.drawFunction(function(x) { return x < -0.1 ? 1/x : NaN; }, -7, -0.1, viz.colors.blue, 2.5);
                                viz.screenText('xy = 1  \u2192  XY = Z\u00B2', viz.width / 2, 20, viz.colors.white, 13);

                                var pulse2 = 0.5 + 0.5 * Math.sin(animPhase * 3);
                                var pR2 = 5 + pulse2 * 3;
                                // [1:0:0] at right
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(viz.originX + R, viz.originY, pR2, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('[1:0:0]', viz.originX + R + 5, viz.originY - 15, viz.colors.orange, 10);
                                // [0:1:0] at top
                                ctx.beginPath();
                                ctx.arc(viz.originX, viz.originY - R, pR2, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('[0:1:0]', viz.originX + 15, viz.originY - R - 8, viz.colors.orange, 10);
                                viz.screenText('+2 points at \u221e', viz.width / 2, viz.height - 15, viz.colors.teal, 12);
                            } else {
                                // Elliptic curve y^2 = x^3 - x
                                var steps = 1000;
                                ctx.fillStyle = viz.colors.blue;
                                for (var i = 0; i < steps; i++) {
                                    var x = -1.5 + 3.5 * i / steps;
                                    var rhs = x * x * x - x;
                                    if (rhs >= 0) {
                                        var y = Math.sqrt(rhs);
                                        var sp1 = viz.toScreen(x, y);
                                        var sp2 = viz.toScreen(x, -y);
                                        ctx.fillRect(sp1[0], sp1[1], 2, 2);
                                        ctx.fillRect(sp2[0], sp2[1], 2, 2);
                                    }
                                }
                                viz.screenText('y\u00B2 = x\u00B3 - x  \u2192  Y\u00B2Z = X\u00B3 - XZ\u00B2', viz.width / 2, 20, viz.colors.white, 13);

                                var pulse3 = 0.5 + 0.5 * Math.sin(animPhase * 3);
                                var pR3 = 5 + pulse3 * 3;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(viz.originX, viz.originY - R, pR3, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('[0:1:0]', viz.originX + 20, viz.originY - R - 5, viz.colors.orange, 11);
                                viz.screenText('+1 point at \u221e (this is the group identity!)', viz.width / 2, viz.height - 15, viz.colors.teal, 12);
                            }
                        }

                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Homogenize the polynomial \\(f = y^2 - x^3 + x\\) and find its points at infinity in \\(\\mathbb{P}^2\\).',
                    hint: 'Degree is 3. Replace \\(x \\to X/Z, y \\to Y/Z\\) and multiply by \\(Z^3\\).',
                    solution: '\\(f^h = Z^3(Y^2/Z^2 - X^3/Z^3 + X/Z) = Y^2Z - X^3 + XZ^2\\). Setting \\(Z = 0\\): \\(-X^3 = 0\\), so \\(X = 0\\). The only point at infinity is \\([0:1:0]\\). (This is the identity element for the elliptic curve group law.)'
                },
                {
                    question: 'Consider \\(V(y - x, y - x^2) \\subset \\mathbb{A}^2\\). Show that homogenizing each generator separately gives a strictly larger projective variety than the projective closure.',
                    hint: 'The affine variety is \\(\\{(0,0), (1,1)\\}\\). Homogenize each generator and find \\(V(Y - X, YZ - X^2)\\) in \\(\\mathbb{P}^2\\). Does it have extra points at infinity?',
                    solution: 'The affine variety is \\(V(y-x) \\cap V(y-x^2) = \\{(0,0),(1,1)\\}\\). Homogenizing: \\(Y - X\\) and \\(YZ - X^2\\). In \\(\\mathbb{P}^2\\), \\(V(Y-X, YZ-X^2)\\): from \\(Y = X\\), substitute into \\(XZ = X^2\\), giving \\(X(Z-X) = 0\\). So \\(X = 0\\) (giving \\([0:0:1]\\) from \\(Y=X=0\\), not valid) or \\(Z = X\\) (giving \\([X:X:X] = [1:1:1]\\) and also \\([0:0:0]\\), not valid). Actually with \\(X=0\\): \\(Y=0\\), so the point \\([0:0:Z] = [0:0:1]\\). This gives \\(\\{[0:0:1], [1:1:1]\\}\\). Now the true closure should also be these 2 points. But consider: if we only homogenize generators of the ideal rather than the full ideal, we might get \\([0:0:1], [1:1:1]\\) plus the point \\([0:0:0]\\)... The real subtlety arises for non-complete-intersection ideals with more generators. The key point is that \\((f_1^h, f_2^h) \\supseteq I(\\overline{V})^h\\) but may be strictly smaller, so \\(V(f_1^h, f_2^h) \\supseteq \\overline{V}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Projective Curves
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From Space to Curves</h2>

<p>We have built projective space \\(\\mathbb{P}^n\\) and defined projective varieties within it. The key ideas are:</p>

<ol>
    <li><strong>Homogeneous coordinates</strong> \\([X_0 : \\cdots : X_n]\\) are defined up to scaling, so only ratios matter.</li>
    <li><strong>Affine charts</strong> cover \\(\\mathbb{P}^n\\) by \\(n+1\\) copies of \\(\\mathbb{A}^n\\). Transition maps are rational.</li>
    <li><strong>Projective varieties</strong> are cut out by homogeneous polynomials. The homogeneous coordinate ring \\(S(Y)\\) is a graded ring encoding the algebra of \\(Y\\).</li>
    <li><strong>Projective closure</strong> embeds affine varieties into projective space by adding points at infinity. This "completes" the variety.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Why This Matters</div>
    <div class="env-body">
        <p>Projective space is the natural setting for intersection theory. In \\(\\mathbb{P}^2\\), B&eacute;zout's theorem says: two curves of degrees \\(d\\) and \\(e\\) with no common component intersect in exactly \\(de\\) points (counted with multiplicity). This clean statement fails in \\(\\mathbb{A}^2\\), where points at infinity are missing.</p>
        <p>The next chapter focuses on <strong>projective curves</strong> in \\(\\mathbb{P}^2\\), studying their singularities, tangent lines, and intersection properties that culminate in B&eacute;zout's theorem.</p>
    </div>
</div>

<h3>The Veronese Embedding</h3>

<p>One of the most elegant maps in projective geometry is the <strong>Veronese embedding</strong>, which shows that higher-degree geometry can always be linearized.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Veronese Embedding)</div>
    <div class="env-body">
        <p>The <strong>degree-\\(d\\) Veronese embedding</strong> is the map \\(v_d : \\mathbb{P}^n \\to \\mathbb{P}^N\\) (where \\(N = \\binom{n+d}{d} - 1\\)) that sends a point to all monomials of degree \\(d\\):</p>
        \\[v_d([X_0 : \\cdots : X_n]) = [X_0^d : X_0^{d-1}X_1 : \\cdots : X_n^d].\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: The Veronese Conic</div>
    <div class="env-body">
        <p>The degree-2 Veronese embedding \\(v_2 : \\mathbb{P}^1 \\to \\mathbb{P}^2\\) sends \\([s:t] \\mapsto [s^2 : st : t^2]\\). The image satisfies \\(XZ = Y^2\\), a conic. Thus <strong>a conic in \\(\\mathbb{P}^2\\) is really just a line in disguise</strong>: it is the image of \\(\\mathbb{P}^1\\) under \\(v_2\\).</p>
        <p>This explains why every smooth conic is isomorphic to \\(\\mathbb{P}^1\\). The conic looks curved, but it is the projective line wearing a quadratic costume.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 4.5</div>
    <div name="env-body">
        <p>The Veronese embedding \\(v_d\\) is an isomorphism onto its image. In particular, it is injective, and the image is a projective variety (cut out by quadratic equations, the \\(2 \\times 2\\) minors of a certain matrix).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-veronese"></div>
`,
            visualizations: [
                {
                    id: 'viz-veronese',
                    title: 'Veronese Embedding: A Conic is Really a Line!',
                    description: 'The degree-2 Veronese map sends P\u00B9 to a conic in P\u00B2. Drag the point on P\u00B9 (left) to see where it maps on the conic (right). The conic is just P\u00B9 in quadratic clothing.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var paramT = 0.5;

                        VizEngine.createSlider(controls, 't \u2208 P\u00B9', -3, 3, paramT, 0.1, function(v) {
                            paramT = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Left panel: P^1 as a line segment with point at infinity
                            var leftCx = 140, leftCy = 200;
                            var lineLen = 200;

                            viz.screenText('P\u00B9 (source)', leftCx, 25, viz.colors.blue, 14);

                            // Draw the line
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(leftCx - lineLen / 2, leftCy);
                            ctx.lineTo(leftCx + lineLen / 2, leftCy);
                            ctx.stroke();

                            // Mark some values
                            for (var i = -3; i <= 3; i++) {
                                var lx = leftCx + i * (lineLen / 7);
                                ctx.fillStyle = viz.colors.text;
                                ctx.beginPath();
                                ctx.arc(lx, leftCy, 2, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText(i.toString(), lx, leftCy + 15, viz.colors.text, 9);
                            }

                            // Mark the selected point
                            var selX = leftCx + paramT * (lineLen / 7);
                            selX = Math.max(leftCx - lineLen / 2, Math.min(leftCx + lineLen / 2, selX));
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.beginPath();
                            ctx.arc(selX, leftCy, 6, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('[1 : ' + paramT.toFixed(1) + ']', selX, leftCy - 15, viz.colors.yellow, 11);

                            // Point at infinity
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(leftCx - lineLen / 2 - 15, leftCy, 4, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(leftCx + lineLen / 2 + 15, leftCy, 4, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('\u221e', leftCx + lineLen / 2 + 15, leftCy - 12, viz.colors.orange, 10);

                            // Right panel: the conic xz = y^2 in affine chart
                            var rightCx = 400, rightCy = 200;
                            var sc = 30;

                            viz.screenText('P\u00B2 (target: conic XZ = Y\u00B2)', rightCx, 25, viz.colors.teal, 14);

                            // Draw axes for the conic
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(rightCx - 130, rightCy);
                            ctx.lineTo(rightCx + 130, rightCy);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(rightCx, rightCy - 150);
                            ctx.lineTo(rightCx, rightCy + 150);
                            ctx.stroke();

                            // Draw the parabola (in the affine chart Z=1: x = y^2, i.e., plotting (t^2, t))
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var s = -4; s <= 4; s += 0.02) {
                                // Veronese: [1:t] -> [1:t:t^2], affine chart Z=1 gives (X/Z, Y/Z) = (1/t^2, 1/t) ...
                                // Better: use affine chart X_0 = 1: [1:t:t^2] has coords (y, z) = (t, t^2)
                                var px = rightCx + s * sc;
                                var py = rightCy - s * s * sc;
                                if (py < rightCy - 150 || py > rightCy + 150) { started = false; continue; }
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Map the selected point: [1:t] -> [1:t:t^2]
                            var imgY = paramT;
                            var imgZ = paramT * paramT;
                            var imgPx = rightCx + imgY * sc;
                            var imgPy = rightCy - imgZ * sc;

                            if (imgPy >= rightCy - 150 && imgPy <= rightCy + 150) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath();
                                ctx.arc(imgPx, imgPy, 6, 0, Math.PI * 2);
                                ctx.fill();
                                viz.screenText('[1:' + paramT.toFixed(1) + ':' + (paramT * paramT).toFixed(1) + ']',
                                    imgPx + 15, imgPy - 10, viz.colors.yellow, 10);
                            }

                            // Arrow between panels
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(250, 190);
                            ctx.lineTo(280, 190);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.purple;
                            ctx.beginPath();
                            ctx.moveTo(285, 190);
                            ctx.lineTo(278, 186);
                            ctx.lineTo(278, 194);
                            ctx.closePath();
                            ctx.fill();
                            viz.screenText('v\u2082', 267, 180, viz.colors.purple, 12);
                            viz.screenText('[s:t] \u21A6 [s\u00B2:st:t\u00B2]', 267, 210, viz.colors.purple, 10);

                            // Axis labels for the conic chart
                            viz.screenText('Y/X = t', rightCx + 120, rightCy + 15, viz.colors.text, 9);
                            viz.screenText('Z/X = t\u00B2', rightCx + 25, rightCy - 140, viz.colors.text, 9);

                            // Bottom text
                            viz.screenText('The conic XZ = Y\u00B2 is isomorphic to P\u00B9 via the Veronese map', viz.width / 2, viz.height - 30, viz.colors.white, 12);
                            viz.screenText('A conic is really just a line in disguise!', viz.width / 2, viz.height - 12, viz.colors.teal, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the degree-2 Veronese embedding \\(v_2 : \\mathbb{P}^2 \\to \\mathbb{P}^5\\). How many equations cut out the image?',
                    hint: 'The monomials of degree 2 in \\(X, Y, Z\\) are \\(X^2, XY, XZ, Y^2, YZ, Z^2\\). Map to \\([X^2 : XY : XZ : Y^2 : YZ : Z^2]\\) and find the relations.',
                    solution: 'Let the coordinates on \\(\\mathbb{P}^5\\) be \\([a:b:c:d:e:f]\\) corresponding to \\([X^2:XY:XZ:Y^2:YZ:Z^2]\\). The \\(2 \\times 2\\) minors of the symmetric matrix \\(\\begin{pmatrix} a & b & c \\\\ b & d & e \\\\ c & e & f \\end{pmatrix}\\) give the equations: \\(ad - b^2, ae - bc, af - c^2, de - be, df - e^2, bf - ce\\). There are \\(\\binom{3}{2} = 3\\) distinct \\(2 \\times 2\\) minors... actually 6 from the \\(3 \\times 3\\) symmetric matrix, but the image is cut out by these 6 quadrics (not all independent; the image has dimension 2 in \\(\\mathbb{P}^5\\), so 3 independent equations suffice).'
                },
                {
                    question: 'Show that the twisted cubic \\([s:t] \\mapsto [s^3:s^2t:st^2:t^3]\\) is the degree-3 Veronese embedding of \\(\\mathbb{P}^1\\) into \\(\\mathbb{P}^3\\). Find its defining equations.',
                    hint: 'Let \\([X_0:X_1:X_2:X_3]\\) be coordinates on \\(\\mathbb{P}^3\\). Use the \\(2 \\times 2\\) minors of a \\(2 \\times 3\\) matrix.',
                    solution: 'Setting \\(X_0 = s^3, X_1 = s^2t, X_2 = st^2, X_3 = t^3\\), the relations are the \\(2 \\times 2\\) minors of \\(\\begin{pmatrix} X_0 & X_1 & X_2 \\\\ X_1 & X_2 & X_3 \\end{pmatrix}\\): \\(X_0X_2 - X_1^2 = 0, \\; X_0X_3 - X_1X_2 = 0, \\; X_1X_3 - X_2^2 = 0\\). These are three quadratic equations. The twisted cubic is a curve (dimension 1) in \\(\\mathbb{P}^3\\) (dimension 3), so we need 2 equations to cut it out set-theoretically, but the ideal requires all 3 generators.'
                },
                {
                    question: 'Explain geometrically why two distinct points in \\(\\mathbb{P}^2\\) determine a unique line, and why two distinct lines in \\(\\mathbb{P}^2\\) determine a unique point.',
                    hint: 'A line in \\(\\mathbb{P}^2\\) is \\(V(aX+bY+cZ)\\) and is itself a point \\([a:b:c]\\) in the dual projective plane.',
                    solution: 'Two distinct points \\(P, Q \\in \\mathbb{P}^2\\) are lines \\(\\ell_P, \\ell_Q\\) through the origin in \\(\\mathbb{A}^3\\). They span a unique plane through the origin, which corresponds to a unique line in \\(\\mathbb{P}^2\\). Dually, two distinct lines in \\(\\mathbb{P}^2\\) are two planes through the origin in \\(\\mathbb{A}^3\\); they intersect in a line through the origin, which is a unique point of \\(\\mathbb{P}^2\\). This is the principle of <strong>projective duality</strong>: points and lines in \\(\\mathbb{P}^2\\) are interchangeable.'
                },
                {
                    question: 'Show that \\(\\mathbb{P}^n\\) cannot be embedded as a closed subvariety of \\(\\mathbb{A}^m\\) for any \\(m\\).',
                    hint: 'Use the fact that the only regular functions on a projective variety are constants. What would an embedding into \\(\\mathbb{A}^m\\) give you?',
                    solution: 'An embedding \\(\\mathbb{P}^n \\hookrightarrow \\mathbb{A}^m\\) would give \\(m\\) regular functions on \\(\\mathbb{P}^n\\) (the coordinate functions). But \\(\\mathbb{P}^n\\) is a projective variety, and by a theorem (consequence of completeness), the only globally regular functions on a connected projective variety over an algebraically closed field are constants: \\(\\mathcal{O}(\\mathbb{P}^n) = k\\). So all coordinate functions would be constant, meaning the image is a single point, contradicting injectivity.'
                }
            ]
        }
    ]
});
