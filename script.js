const digits = [
  { name: "Black", label: "Black (0)", value: 0, color: "#0d1016", text: "#f5f7fb" },
  { name: "Brown", label: "Brown (1)", value: 1, color: "#5e3a27", text: "#f7f2ed" },
  { name: "Red", label: "Red (2)", value: 2, color: "#cc2f2f", text: "#fff6f6" },
  { name: "Orange", label: "Orange (3)", value: 3, color: "#ef6c00", text: "#1f1200" },
  { name: "Yellow", label: "Yellow (4)", value: 4, color: "#f5c518", text: "#241900" },
  { name: "Green", label: "Green (5)", value: 5, color: "#2f8f46", text: "#f4fff7" },
  { name: "Blue", label: "Blue (6)", value: 6, color: "#1f63c4", text: "#f3f8ff" },
  { name: "Violet", label: "Violet (7)", value: 7, color: "#7d41c7", text: "#f8f1ff" },
  { name: "Gray", label: "Gray (8)", value: 8, color: "#8a8f9a", text: "#ffffff" },
  { name: "White", label: "White (9)", value: 9, color: "#f2f4f7", text: "#12203d" }
];

const multipliers = [
  { name: "Silver", label: "Silver (x0.01)", value: 0.01, color: "#c3c9d3", text: "#1d2a41" },
  { name: "Gold", label: "Gold (x0.1)", value: 0.1, color: "#d9b14c", text: "#1f1500" },
  { name: "Black", label: "Black (x1)", value: 1, color: "#0d1016", text: "#f5f7fb" },
  { name: "Brown", label: "Brown (x10)", value: 10, color: "#5e3a27", text: "#f7f2ed" },
  { name: "Red", label: "Red (x100)", value: 100, color: "#cc2f2f", text: "#fff6f6" },
  { name: "Orange", label: "Orange (x1k)", value: 1000, color: "#ef6c00", text: "#1f1200" },
  { name: "Yellow", label: "Yellow (x10k)", value: 10000, color: "#f5c518", text: "#241900" },
  { name: "Green", label: "Green (x100k)", value: 100000, color: "#2f8f46", text: "#f4fff7" },
  { name: "Blue", label: "Blue (x1M)", value: 1000000, color: "#1f63c4", text: "#f3f8ff" },
  { name: "Violet", label: "Violet (x10M)", value: 10000000, color: "#7d41c7", text: "#f8f1ff" },
  { name: "Gray", label: "Gray (x100M)", value: 100000000, color: "#8a8f9a", text: "#ffffff" },
  { name: "White", label: "White (x1G)", value: 1000000000, color: "#f2f4f7", text: "#12203d" }
];

const tolerances = [
  { name: "Brown", label: "Brown (+/-1%)", value: 1, color: "#5e3a27", text: "#f7f2ed" },
  { name: "Red", label: "Red (+/-2%)", value: 2, color: "#cc2f2f", text: "#fff6f6" },
  { name: "Green", label: "Green (+/-0.5%)", value: 0.5, color: "#2f8f46", text: "#f4fff7" },
  { name: "Blue", label: "Blue (+/-0.25%)", value: 0.25, color: "#1f63c4", text: "#f3f8ff" },
  { name: "Violet", label: "Violet (+/-0.1%)", value: 0.1, color: "#7d41c7", text: "#f8f1ff" },
  { name: "Gray", label: "Gray (+/-0.05%)", value: 0.05, color: "#8a8f9a", text: "#ffffff" },
  { name: "Gold", label: "Gold (+/-5%)", value: 5, color: "#d9b14c", text: "#1f1500" },
  { name: "Silver", label: "Silver (+/-10%)", value: 10, color: "#c3c9d3", text: "#1d2a41" },
  { name: "None", label: "None (+/-20%)", value: 20, color: "#f1dfbe", text: "#34240f", none: true }
];

const tempcos = [
  { name: "Black", label: "Black (250 ppm/degC)", value: 250, color: "#0d1016", text: "#f5f7fb" },
  { name: "Brown", label: "Brown (100 ppm/degC)", value: 100, color: "#5e3a27", text: "#f7f2ed" },
  { name: "Red", label: "Red (50 ppm/degC)", value: 50, color: "#cc2f2f", text: "#fff6f6" },
  { name: "Orange", label: "Orange (15 ppm/degC)", value: 15, color: "#ef6c00", text: "#1f1200" },
  { name: "Yellow", label: "Yellow (25 ppm/degC)", value: 25, color: "#f5c518", text: "#241900" },
  { name: "Green", label: "Green (20 ppm/degC)", value: 20, color: "#2f8f46", text: "#f4fff7" },
  { name: "Blue", label: "Blue (10 ppm/degC)", value: 10, color: "#1f63c4", text: "#f3f8ff" },
  { name: "Violet", label: "Violet (5 ppm/degC)", value: 5, color: "#7d41c7", text: "#f8f1ff" },
  { name: "Gray", label: "Gray (1 ppm/degC)", value: 1, color: "#8a8f9a", text: "#ffffff" }
];

const MU0 = 4 * Math.PI * 1e-7;

const dcdcConfigs = {
  buck: { title: "Buck Converter", prefix: "buck", filename: "buck-converter-report" },
  boost: { title: "Boost Converter", prefix: "boost", filename: "boost-converter-report" },
  buckboost: { title: "Buck-Boost Converter", prefix: "bb", filename: "buck-boost-converter-report" }
};

const dcdcReports = {};

const setResult = (id, message, isError = false) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("error", isError);
};

const toNumber = (id) => {
  const field = document.getElementById(id);
  if (!field) return null;
  const raw = field.value.trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

const fmtNumber = (value, digitsCount = 2) => value.toFixed(digitsCount);

const fmt = (value, unit = "") => {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(3)} G${unit}`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(3)} M${unit}`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(3)} k${unit}`;
  if (abs >= 1) return `${value.toFixed(3)} ${unit}`.trim();
  if (abs >= 1e-3) return `${(value * 1e3).toFixed(3)} m${unit}`;
  if (abs >= 1e-6) return `${(value * 1e6).toFixed(3)} u${unit}`;
  if (abs === 0) return `0 ${unit}`.trim();
  return `${value.toExponential(3)} ${unit}`.trim();
};

const E12_SERIES = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

const nearestE12 = (value) => {
  if (!Number.isFinite(value) || value <= 0) return null;
  let best = value;
  let bestErr = Number.POSITIVE_INFINITY;
  for (let decade = -1; decade <= 9; decade += 1) {
    const scale = 10 ** decade;
    E12_SERIES.forEach((base) => {
      const candidate = base * scale;
      const err = Math.abs(candidate - value);
      if (err < bestErr) {
        best = candidate;
        bestErr = err;
      }
    });
  }
  return best;
};

const validatePositive = (values) => values.every((value) => value !== null && value > 0);

const readDcdcInputs = (topology) => {
  const config = dcdcConfigs[topology];
  if (!config) return null;
  const p = config.prefix;
  return {
    vinMin: toNumber(`${p}-vin-min`),
    vinMax: toNumber(`${p}-vin-max`),
    vout: toNumber(`${p}-vout`),
    iout: toNumber(`${p}-iout`),
    fswKhz: toNumber(`${p}-fsw`),
    ripplePct: toNumber(`${p}-ripple`),
    vRipplePct: toNumber(`${p}-vripple`),
    eff: toNumber(`${p}-eff`),
    aeMm2: toNumber(`${p}-ae`),
    bMax: toNumber(`${p}-bmax`),
    currentDensity: toNumber(`${p}-j`),
    hsRdsonmOhm: toNumber(`${p}-hs-rdson`),
    hsQgNc: toNumber(`${p}-hs-qg`),
    hsTrTfNs: toNumber(`${p}-hs-trtf`),
    hsGateDrive: toNumber(`${p}-hs-vgate`),
    lsRdsonmOhm: toNumber(`${p}-ls-rdson`),
    lsQgNc: toNumber(`${p}-ls-qg`),
    lsTrTfNs: toNumber(`${p}-ls-trtf`),
    lsGateDrive: toNumber(`${p}-ls-vgate`),
    ambient: toNumber(`${p}-ta`),
    tjMax: toNumber(`${p}-tjmax`),
    rthJc: toNumber(`${p}-rthjc`),
    rthCs: toNumber(`${p}-rthcs`)
  };
};

const validateDcdcInputs = (topology, input) => {
  const positiveRequired = [
    input.vinMin,
    input.vinMax,
    input.vout,
    input.iout,
    input.fswKhz,
    input.ripplePct,
    input.vRipplePct,
    input.eff,
    input.aeMm2,
    input.bMax,
    input.currentDensity,
    input.hsRdsonmOhm,
    input.hsQgNc,
    input.hsTrTfNs,
    input.hsGateDrive,
    input.lsRdsonmOhm,
    input.lsQgNc,
    input.lsTrTfNs,
    input.lsGateDrive,
    input.tjMax,
    input.rthJc,
    input.rthCs
  ];
  if (!validatePositive(positiveRequired)) {
    return "Enter valid values greater than zero in all required fields.";
  }
  if (input.ambient === null || input.ambient < -55 || input.ambient > 200) {
    return "Ambient temperature must be between -55 degC and 200 degC.";
  }
  if (input.vinMax < input.vinMin) {
    return "Vin Max must be greater than or equal to Vin Min.";
  }
  if (input.ripplePct >= 100) {
    return "Inductor ripple percentage must be below 100%.";
  }
  if (input.vRipplePct >= 10) {
    return "Output ripple percentage should stay below 10%.";
  }
  if (input.eff > 100) {
    return "Efficiency cannot exceed 100%.";
  }
  if (input.tjMax <= input.ambient + 5) {
    return "Max junction temp must be at least 5 degC above ambient.";
  }
  if (topology === "buck" && input.vout >= input.vinMin) {
    return "Buck requires Vout lower than Vin Min.";
  }
  if (topology === "boost" && input.vout <= input.vinMax) {
    return "Boost typically requires Vout higher than Vin Max.";
  }
  return null;
};

const calcBuck = (input) => {
  const fs = input.fswKhz * 1e3;
  const eta = input.eff / 100;
  const duty = input.vout / input.vinMax;
  if (duty <= 0 || duty >= 1) {
    throw new Error("Invalid duty cycle. Check Buck voltages.");
  }

  const deltaIL = input.iout * (input.ripplePct / 100);
  const vRipple = input.vout * (input.vRipplePct / 100);
  const L = ((input.vinMax - input.vout) * duty) / (deltaIL * fs);
  const C = deltaIL / (8 * fs * vRipple);
  const pOut = input.vout * input.iout;
  const pIn = pOut / eta;
  const iIn = pIn / input.vinMin;
  const iPeak = input.iout + deltaIL / 2;
  const iRms = Math.sqrt(input.iout ** 2 + (deltaIL ** 2) / 12);

  return {
    duty,
    deltaIL,
    L,
    C,
    pOut,
    pIn,
    iIn,
    iAvgForMag: input.iout,
    iPeak,
    iRms,
    switchVoltRating: input.vinMax * 1.3,
    switchCurrentRating: iPeak * 1.25,
    diodeVoltRating: input.vinMax * 1.3,
    diodeCurrentRating: input.iout * (1 - duty) * 1.25
  };
};

const calcBoost = (input) => {
  const fs = input.fswKhz * 1e3;
  const eta = input.eff / 100;
  const duty = 1 - ((input.vinMin * eta) / input.vout);
  if (duty <= 0 || duty >= 0.95) {
    throw new Error("Invalid duty cycle. Check Boost voltages and efficiency.");
  }

  const pOut = input.vout * input.iout;
  const pIn = pOut / eta;
  const iIn = pIn / input.vinMin;
  const deltaIL = iIn * (input.ripplePct / 100);
  const vRipple = input.vout * (input.vRipplePct / 100);
  const L = (input.vinMin * duty) / (deltaIL * fs);
  const C = (input.iout * duty) / (fs * vRipple);
  const iPeak = iIn + deltaIL / 2;
  const iRms = Math.sqrt(iIn ** 2 + (deltaIL ** 2) / 12);

  return {
    duty,
    deltaIL,
    L,
    C,
    pOut,
    pIn,
    iIn,
    iAvgForMag: iIn,
    iPeak,
    iRms,
    switchVoltRating: input.vout * 1.3,
    switchCurrentRating: iPeak * 1.25,
    diodeVoltRating: input.vout * 1.3,
    diodeCurrentRating: iPeak * 1.1
  };
};

const calcBuckBoost = (input) => {
  const fs = input.fswKhz * 1e3;
  const eta = input.eff / 100;
  const duty = input.vout / (input.vout + input.vinMin * eta);
  if (duty <= 0 || duty >= 0.95) {
    throw new Error("Invalid duty cycle. Check Buck-Boost parameters.");
  }

  const pOut = input.vout * input.iout;
  const pIn = pOut / eta;
  const iIn = pIn / input.vinMin;
  const deltaIL = iIn * (input.ripplePct / 100);
  const vRipple = input.vout * (input.vRipplePct / 100);
  const L = (input.vinMin * duty) / (deltaIL * fs);
  const C = (input.iout * duty) / (fs * vRipple);
  const iPeak = iIn + deltaIL / 2;
  const iRms = Math.sqrt(iIn ** 2 + (deltaIL ** 2) / 12);
  const stress = input.vinMax + input.vout;

  return {
    duty,
    deltaIL,
    L,
    C,
    pOut,
    pIn,
    iIn,
    iAvgForMag: iIn,
    iPeak,
    iRms,
    switchVoltRating: stress * 1.3,
    switchCurrentRating: iPeak * 1.25,
    diodeVoltRating: stress * 1.3,
    diodeCurrentRating: iPeak * 1.1
  };
};

const calcMagnetics = (input, power) => {
  const ae = input.aeMm2 * 1e-6;
  const turnsRaw = (power.L * power.iPeak) / (input.bMax * ae);
  if (!Number.isFinite(turnsRaw) || turnsRaw <= 0) {
    throw new Error("Magnetics calculation failed. Check core inputs.");
  }

  const turns = Math.max(1, Math.ceil(turnsRaw));
  const gap = (MU0 * turns ** 2 * ae) / power.L;
  const energy = 0.5 * power.L * power.iPeak ** 2;
  const wireArea = power.iRms / input.currentDensity;

  return { turns, gap, energy, wireArea };
};

const calcMosfetPerformance = (topology, input, power) => {
  const fs = input.fswKhz * 1e3;
  const stressVoltage = topology === "buck"
    ? input.vinMax
    : topology === "boost"
      ? input.vout
      : input.vinMax + input.vout;
  const hsDuty = topology === "buck" ? power.duty : (1 - power.duty);
  const lsDuty = 1 - hsDuty;
  const hsRds = input.hsRdsonmOhm * 1e-3;
  const lsRds = input.lsRdsonmOhm * 1e-3;
  const hsTrTf = input.hsTrTfNs * 1e-9;
  const lsTrTf = input.lsTrTfNs * 1e-9;
  const hsQg = input.hsQgNc * 1e-9;
  const lsQg = input.lsQgNc * 1e-9;

  const hsConduction = power.iRms ** 2 * hsRds * hsDuty;
  const lsConduction = power.iRms ** 2 * lsRds * lsDuty;
  const hsSwitching = 0.5 * stressVoltage * power.iPeak * hsTrTf * fs;
  const lsSwitching = 0.5 * stressVoltage * power.iPeak * lsTrTf * fs;
  const hsGate = hsQg * input.hsGateDrive * fs;
  const lsGate = lsQg * input.lsGateDrive * fs;
  const hsTotal = hsConduction + hsSwitching + hsGate;
  const lsTotal = lsConduction + lsSwitching + lsGate;
  const total = hsTotal + lsTotal;
  const otherRaw = Math.max(0.02, (power.iRms ** 2 * 0.02) + (0.00006 * input.fswKhz * power.iPeak * input.vout) + (0.004 * power.pOut));
  const etaEstimated = power.pOut / (power.pOut + total + otherRaw);

  return {
    stressVoltage,
    hsDuty,
    lsDuty,
    hs: {
      conduction: hsConduction,
      switching: hsSwitching,
      gate: hsGate,
      total: hsTotal
    },
    ls: {
      conduction: lsConduction,
      switching: lsSwitching,
      gate: lsGate,
      total: lsTotal
    },
    total,
    etaEstimated
  };
};

const calcLossBreakdown = (topology, input, power, mosfetPerf) => {
  const targetTotalLoss = Math.max(power.pIn - power.pOut, 0);

  const diodeVf = topology === "buck" ? 0.55 : 0.65;
  const inductorDcr = topology === "buck" ? 0.016 : 0.022;
  const switchConductionRaw = mosfetPerf
    ? mosfetPerf.hs.conduction + mosfetPerf.ls.conduction
    : power.iRms ** 2 * (topology === "buck" ? 0.018 : 0.022) * Math.max(power.duty, 0.08);
  const switchSwitchingRaw = mosfetPerf
    ? mosfetPerf.hs.switching + mosfetPerf.ls.switching + mosfetPerf.hs.gate + mosfetPerf.ls.gate
    : 0.5 * (topology === "buck" ? input.vinMax : topology === "boost" ? input.vout : input.vinMax + input.vout) * power.iPeak * 45e-9 * (input.fswKhz * 1e3);
  const diodeCurrentAvg = topology === "buck" ? input.iout * (1 - power.duty) : input.iout;
  const diodeRaw = mosfetPerf ? 0 : diodeVf * Math.max(diodeCurrentAvg, 0);
  const inductorCopperRaw = power.iRms ** 2 * inductorDcr;
  const inductorCoreRaw = Math.max(0.03, 0.00006 * input.fswKhz * power.iPeak * input.vout);
  const miscRaw = Math.max(0.02, 0.004 * power.pOut);

  const rawItems = [
    { key: "switchConduction", label: "Switch Conduction", value: switchConductionRaw },
    { key: "switchSwitching", label: "Switch Switching", value: switchSwitchingRaw },
    { key: "diode", label: "Diode", value: diodeRaw },
    { key: "inductorCopper", label: "Inductor Copper", value: inductorCopperRaw },
    { key: "inductorCore", label: "Inductor Core", value: inductorCoreRaw },
    { key: "misc", label: "Miscellaneous", value: miscRaw }
  ];

  const rawTotal = rawItems.reduce((sum, item) => sum + item.value, 0);
  const scale = rawTotal > 0 ? targetTotalLoss / rawTotal : 0;
  const scaledItems = rawItems.map((item) => ({
    ...item,
    value: Math.max(item.value * scale, 0)
  }));
  const totalLoss = scaledItems.reduce((sum, item) => sum + item.value, 0);
  const byKey = scaledItems.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return { items: scaledItems, totalLoss, byKey };
};

const classifyLossCase = (percent, normalMax, mediumMax) => {
  if (percent <= normalMax) return "normal";
  if (percent <= mediumMax) return "medium";
  return "abnormal";
};

const lossCaseLabel = (state) => {
  if (state === "normal") return "NORMAL";
  if (state === "medium") return "MEDIUM";
  return "ABNORMAL";
};

const clearLossChart = (topology) => {
  const chart = document.getElementById(`${topology}-loss-chart`);
  if (!chart) return;
  chart.innerHTML = "";
};

const renderLossChart = (topology, items, totalLoss, pOut = 0) => {
  const chart = document.getElementById(`${topology}-loss-chart`);
  if (!chart) return;

  if (!items.length || totalLoss <= 0) {
    chart.innerHTML = '<p class="loss-label">No measurable converter loss for chart rendering.</p>';
    return;
  }

  const totalLossPctOfOut = pOut > 0 ? (totalLoss / pOut) * 100 : 0;
  const overallCase = classifyLossCase(totalLossPctOfOut, 8, 16);

  const rows = items.map((item) => {
    const pct = totalLoss > 0 ? (item.value / totalLoss) * 100 : 0;
    const width = Math.max(pct, 2);
    const itemCase = classifyLossCase(pct, 20, 40);
    return `
      <div class="loss-row">
        <span class="loss-label">${item.label}</span>
        <div class="loss-track">
          <div class="loss-fill state-${itemCase}" style="width:${width.toFixed(2)}%"></div>
        </div>
        <span class="loss-value state-${itemCase}">${fmt(item.value, "W")} (${pct.toFixed(1)}%)</span>
      </div>
    `;
  }).join("");

  chart.innerHTML = `
    <div class="loss-legend">
      <span class="loss-legend-item"><span class="loss-dot normal"></span>Normal</span>
      <span class="loss-legend-item"><span class="loss-dot medium"></span>Medium</span>
      <span class="loss-legend-item"><span class="loss-dot abnormal"></span>Abnormal</span>
    </div>
    <div class="loss-state is-${overallCase}">Overall Case: ${lossCaseLabel(overallCase)} (${fmtNumber(totalLossPctOfOut, 2)}% of Pout)</div>
    ${rows}
  `;
};

const classifyHeatsink = (requiredRthSa, dominantLoss) => {
  if (dominantLoss < 0.6) {
    return "Low dissipation. PCB copper area is often sufficient.";
  }
  if (!Number.isFinite(requiredRthSa)) {
    return "Unable to estimate sink requirement. Check thermal inputs.";
  }
  if (requiredRthSa <= 0) {
    return "Target cannot be met passively. Use larger package or forced airflow.";
  }
  if (requiredRthSa <= 2) {
    return "Use a large finned heatsink and consider airflow.";
  }
  if (requiredRthSa <= 5) {
    return "Use a medium extruded heatsink.";
  }
  if (requiredRthSa <= 10) {
    return "Use a compact clip-on heatsink.";
  }
  return "A small stamped sink or extra copper area should be enough.";
};

const calcThermal = (input, losses) => {
  const deviceLosses = [
    {
      name: "Switch",
      value: (losses.byKey.switchConduction || 0) + (losses.byKey.switchSwitching || 0)
    },
    { name: "Diode", value: losses.byKey.diode || 0 },
    {
      name: "Inductor",
      value: (losses.byKey.inductorCopper || 0) + (losses.byKey.inductorCore || 0)
    }
  ];
  const hottest = deviceLosses.reduce((max, item) => (item.value > max.value ? item : max), deviceLosses[0]);
  const deltaTAllowed = input.tjMax - input.ambient;
  const totalRthAllowed = hottest.value > 0 ? deltaTAllowed / hottest.value : Number.POSITIVE_INFINITY;
  const requiredRthSa = totalRthAllowed - input.rthJc - input.rthCs;
  const junctionNoSink = input.ambient + hottest.value * (input.rthJc + input.rthCs + 35);
  const junctionWith10Sink = input.ambient + hottest.value * (input.rthJc + input.rthCs + 10);
  const recommendation = classifyHeatsink(requiredRthSa, hottest.value);

  return {
    hottest,
    deltaTAllowed,
    totalRthAllowed,
    requiredRthSa,
    junctionNoSink,
    junctionWith10Sink,
    recommendation
  };
};

const buildInputLines = (input) => ([
  `Vin range: ${fmt(input.vinMin, "V")} to ${fmt(input.vinMax, "V")}`,
  `Vout: ${fmt(input.vout, "V")} | Iout: ${fmt(input.iout, "A")}`,
  `Switching frequency: ${fmt(input.fswKhz * 1e3, "Hz")}`,
  `Inductor ripple target: ${fmtNumber(input.ripplePct)} %`,
  `Output ripple target: ${fmtNumber(input.vRipplePct)} %`,
  `Efficiency target: ${fmtNumber(input.eff)} %`,
  `Core Ae: ${fmt(input.aeMm2, "mm^2")} | Bmax: ${fmtNumber(input.bMax, 3)} T`,
  `Current density J: ${fmt(input.currentDensity, "A/mm^2")}`,
  `Top MOSFET: Rds(on)=${fmt(input.hsRdsonmOhm, "mohm")} | Qg=${fmt(input.hsQgNc, "nC")} | tr+tf=${fmt(input.hsTrTfNs, "ns")}`,
  `Top gate drive Vgs: ${fmt(input.hsGateDrive, "V")}`,
  `Bottom MOSFET: Rds(on)=${fmt(input.lsRdsonmOhm, "mohm")} | Qg=${fmt(input.lsQgNc, "nC")} | tr+tf=${fmt(input.lsTrTfNs, "ns")}`,
  `Bottom gate drive Vgs: ${fmt(input.lsGateDrive, "V")}`,
  `Ambient temp: ${fmt(input.ambient, "degC")} | Max junction: ${fmt(input.tjMax, "degC")}`,
  `RthJC: ${fmt(input.rthJc, "degC/W")} | RthCS: ${fmt(input.rthCs, "degC/W")}`
]);

const buildPowerLines = (power) => ([
  `Duty cycle D: ${fmtNumber(power.duty * 100)} %`,
  `Inductor L (minimum): ${fmt(power.L, "H")}`,
  `Output capacitor C (minimum): ${fmt(power.C, "F")}`,
  `Estimated output power: ${fmt(power.pOut, "W")}`,
  `Estimated input power: ${fmt(power.pIn, "W")}`,
  `Estimated input current: ${fmt(power.iIn, "A")}`,
  `Switch rating recommendation: >= ${fmt(power.switchVoltRating, "V")} and ${fmt(power.switchCurrentRating, "A")} peak`,
  `Diode rating recommendation: >= ${fmt(power.diodeVoltRating, "V")} and ${fmt(power.diodeCurrentRating, "A")}`
]);

const buildMagneticLines = (input, power, magnetic) => ([
  `Inductor average current: ${fmt(power.iAvgForMag, "A")}`,
  `Inductor peak current: ${fmt(power.iPeak, "A")}`,
  `Inductor ripple current: ${fmt(power.deltaIL, "A")}`,
  `Stored energy (peak): ${fmt(magnetic.energy, "J")}`,
  `Estimated turns (N): ${magnetic.turns}`,
  `Estimated air gap: ${fmt(magnetic.gap, "m")}`,
  `Required copper area @ J=${fmt(input.currentDensity, "A/mm^2")}: ${fmt(magnetic.wireArea, "mm^2")}`
]);

const buildMosfetLines = (mosfet, power) => ([
  `Top MOSFET conduction: ${fmt(mosfet.hs.conduction, "W")} | switching: ${fmt(mosfet.hs.switching, "W")} | gate: ${fmt(mosfet.hs.gate, "W")}`,
  `Top MOSFET total: ${fmt(mosfet.hs.total, "W")} | conduction duty: ${fmtNumber(mosfet.hsDuty * 100, 1)} %`,
  `Bottom MOSFET conduction: ${fmt(mosfet.ls.conduction, "W")} | switching: ${fmt(mosfet.ls.switching, "W")} | gate: ${fmt(mosfet.ls.gate, "W")}`,
  `Bottom MOSFET total: ${fmt(mosfet.ls.total, "W")} | conduction duty: ${fmtNumber(mosfet.lsDuty * 100, 1)} %`,
  `Total MOSFET dissipation: ${fmt(mosfet.total, "W")}`,
  `Estimated efficiency with MOSFET model: ${fmtNumber(mosfet.etaEstimated * 100, 2)} %`,
  `Suggested minimum VDS rating (top/bottom): ${fmt(mosfet.stressVoltage * 1.3, "V")}`,
  `Suggested minimum ID pulse rating (top/bottom): ${fmt(power.iPeak * 1.25, "A")}`,
  "Note: Top = high-side MOSFET, Bottom = low-side MOSFET."
]);

const buildLossLines = (losses, power) => {
  const lossPct = power.pOut > 0 ? (losses.totalLoss / power.pOut) * 100 : 0;
  return [
    `Overall loss case: ${lossCaseLabel(classifyLossCase(lossPct, 8, 16))}`,
    `Loss ratio vs output power: ${fmtNumber(lossPct, 2)} %`,
    `Estimated total converter loss: ${fmt(losses.totalLoss, "W")}`,
    ...losses.items.map((item) => {
      const pct = losses.totalLoss > 0 ? (item.value / losses.totalLoss) * 100 : 0;
      return `${item.label}: ${fmt(item.value, "W")} (${fmtNumber(pct, 1)}%)`;
    }),
    `Estimated converter efficiency from model: ${fmtNumber((power.pOut / power.pIn) * 100, 2)} %`
  ];
};

const buildThermalLines = (thermal) => {
  const sinkLine = thermal.requiredRthSa > 0
    ? `Required heatsink RthSA <= ${fmt(thermal.requiredRthSa, "degC/W")}`
    : "Required heatsink RthSA <= 0 degC/W (passive sink not enough).";
  return [
    `Dominant heating component: ${thermal.hottest.name} at ${fmt(thermal.hottest.value, "W")}`,
    `Thermal budget (Tjmax - Ta): ${fmt(thermal.deltaTAllowed, "degC")}`,
    `Total allowable thermal path: ${fmt(thermal.totalRthAllowed, "degC/W")}`,
    sinkLine,
    `Estimated Tj with no dedicated sink (~35 degC/W): ${fmt(thermal.junctionNoSink, "degC")}`,
    `Estimated Tj with 10 degC/W sink: ${fmt(thermal.junctionWith10Sink, "degC")}`,
    `Heatsink guidance: ${thermal.recommendation}`
  ];
};

const setDcdcError = (topology, message) => {
  setResult(`${topology}-power-result`, message, true);
  setResult(`${topology}-mag-result`, "", false);
  setResult(`${topology}-mosfet-result`, "", false);
  setResult(`${topology}-loss-result`, "", false);
  setResult(`${topology}-thermal-result`, "", false);
  clearLossChart(topology);
};

const runDcdcCalculation = (topology) => {
  const input = readDcdcInputs(topology);
  if (!input) return false;

  const validationError = validateDcdcInputs(topology, input);
  if (validationError) {
    setDcdcError(topology, validationError);
    return false;
  }

  let power;
  try {
    if (topology === "buck") power = calcBuck(input);
    if (topology === "boost") power = calcBoost(input);
    if (topology === "buckboost") power = calcBuckBoost(input);
  } catch (error) {
    setDcdcError(topology, error.message);
    return false;
  }

  if (!power) {
    setDcdcError(topology, "Unsupported topology.");
    return false;
  }

  let magnetic;
  try {
    magnetic = calcMagnetics(input, power);
  } catch (error) {
    setDcdcError(topology, error.message);
    return false;
  }

  let mosfet;
  try {
    mosfet = calcMosfetPerformance(topology, input, power);
  } catch (error) {
    setDcdcError(topology, error.message);
    return false;
  }

  let losses;
  try {
    losses = calcLossBreakdown(topology, input, power, mosfet);
  } catch (error) {
    setDcdcError(topology, error.message);
    return false;
  }

  let thermal;
  try {
    thermal = calcThermal(input, losses);
  } catch (error) {
    setDcdcError(topology, error.message);
    return false;
  }

  const inputLines = buildInputLines(input);
  const powerLines = buildPowerLines(power);
  const magneticLines = buildMagneticLines(input, power, magnetic);
  const mosfetLines = buildMosfetLines(mosfet, power);
  const lossLines = buildLossLines(losses, power);
  const thermalLines = buildThermalLines(thermal);
  setResult(`${topology}-power-result`, powerLines.join("\n"));
  setResult(`${topology}-mag-result`, magneticLines.join("\n"));
  setResult(`${topology}-mosfet-result`, mosfetLines.join("\n"));
  setResult(`${topology}-loss-result`, lossLines.join("\n"));
  setResult(`${topology}-thermal-result`, thermalLines.join("\n"));
  renderLossChart(topology, losses.items, losses.totalLoss, power.pOut);

  dcdcReports[topology] = {
    title: dcdcConfigs[topology].title,
    generatedAt: new Date(),
    inputLines,
    powerLines,
    magneticLines,
    mosfetLines,
    lossLines,
    thermalLines
  };

  return true;
};

const writePdfLines = (doc, lines, startY) => {
  let y = startY;
  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 180);
    wrapped.forEach((part) => {
      if (y > 282) {
        doc.addPage();
        y = 18;
      }
      doc.text(part, 14, y);
      y += 5;
    });
  });
  return y;
};

const downloadDcdcReport = (topology) => {
  const config = dcdcConfigs[topology];
  if (!config) return;

  if (!dcdcReports[topology]) {
    const ok = runDcdcCalculation(topology);
    if (!ok) return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    setDcdcError(topology, "PDF library not loaded. Check network and reload the page.");
    return;
  }

  const report = dcdcReports[topology];
  const generatedText = report.generatedAt.toLocaleString();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`${report.title} Design Report`, 14, 16);
  doc.setFontSize(10);
  doc.text(`Generated: ${generatedText}`, 14, 22);

  let y = 31;
  doc.setFontSize(12);
  doc.text("Input Parameters", 14, y);
  y += 6;
  doc.setFontSize(10);
  y = writePdfLines(doc, report.inputLines, y);

  y += 4;
  if (y > 278) {
    doc.addPage();
    y = 18;
  }
  doc.setFontSize(12);
  doc.text("Power Component Selection", 14, y);
  y += 6;
  doc.setFontSize(10);
  y = writePdfLines(doc, report.powerLines, y);

  y += 4;
  if (y > 278) {
    doc.addPage();
    y = 18;
  }
  doc.setFontSize(12);
  doc.text("Magnetics Selection", 14, y);
  y += 6;
  doc.setFontSize(10);
  y = writePdfLines(doc, report.magneticLines, y);

  y += 4;
  if (y > 278) {
    doc.addPage();
    y = 18;
  }
  doc.setFontSize(12);
  doc.text("MOSFET Performance (Top and Bottom)", 14, y);
  y += 6;
  doc.setFontSize(10);
  y = writePdfLines(doc, report.mosfetLines || [], y);

  y += 4;
  if (y > 278) {
    doc.addPage();
    y = 18;
  }
  doc.setFontSize(12);
  doc.text("Power Loss Breakdown", 14, y);
  y += 6;
  doc.setFontSize(10);
  y = writePdfLines(doc, report.lossLines || [], y);

  y += 4;
  if (y > 278) {
    doc.addPage();
    y = 18;
  }
  doc.setFontSize(12);
  doc.text("Thermal and Heatsink Selection", 14, y);
  y += 6;
  doc.setFontSize(10);
  writePdfLines(doc, report.thermalLines || [], y);

  doc.save(`${config.filename}.pdf`);
};

const setActiveTab = (buttons, panels, selectedId, datasetKey) => {
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset[datasetKey] === selectedId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === selectedId);
  });
};

const initMainTabs = () => {
  const buttons = Array.from(document.querySelectorAll("[data-tab-target]"));
  const panels = Array.from(document.querySelectorAll(".panel"));
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(buttons, panels, button.dataset.tabTarget, "tabTarget");
    });
  });
};

const initTopologyTabs = () => {
  const buttons = Array.from(document.querySelectorAll("[data-topology-target]"));
  const panels = Array.from(document.querySelectorAll(".dcdc-topology"));
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(buttons, panels, button.dataset.topologyTarget, "topologyTarget");
    });
  });
};

const calculateOhmsLaw = () => {
  const v = toNumber("ohm-voltage");
  const i = toNumber("ohm-current");
  const r = toNumber("ohm-resistance");
  const known = [v, i, r].filter((x) => x !== null).length;

  if (known !== 2) {
    setResult("ohm-result", "Enter exactly two values.", true);
    return;
  }

  if (v === null && i !== null && r !== null) {
    setResult("ohm-result", `Voltage = ${fmt(i * r, "V")}`);
    return;
  }
  if (i === null && v !== null && r !== null && r !== 0) {
    setResult("ohm-result", `Current = ${fmt(v / r, "A")}`);
    return;
  }
  if (r === null && v !== null && i !== null && i !== 0) {
    setResult("ohm-result", `Resistance = ${fmt(v / i, "ohm")}`);
    return;
  }
  setResult("ohm-result", "Invalid values. Check for zero division.", true);
};

const calculateDivider = () => {
  const vin = toNumber("vd-vin");
  const r1 = toNumber("vd-r1");
  const r2 = toNumber("vd-r2");
  if ([vin, r1, r2].some((x) => x === null || x < 0)) {
    setResult("vd-result", "Please enter valid positive numbers.", true);
    return;
  }
  const denom = r1 + r2;
  if (denom <= 0) {
    setResult("vd-result", "R1 + R2 must be greater than zero.", true);
    return;
  }
  const vout = vin * (r2 / denom);
  setResult("vd-result", `Vout = ${fmt(vout, "V")}`);
};

const calculateLedResistor = () => {
  const vs = toNumber("led-vsupply");
  const vf = toNumber("led-vf");
  const imA = toNumber("led-current");
  if ([vs, vf, imA].some((x) => x === null || x <= 0)) {
    setResult("led-result", "Enter values greater than zero.", true);
    return;
  }
  if (vf >= vs) {
    setResult("led-result", "Supply voltage must be greater than Vf.", true);
    return;
  }
  const i = imA / 1000;
  const r = (vs - vf) / i;
  const p = (vs - vf) * i;
  setResult("led-result", `R = ${fmt(r, "ohm")} | Power >= ${fmt(p, "W")}`);
};

const transistorHeatsinkHint = (rthJaRequired) => {
  if (!Number.isFinite(rthJaRequired)) return "Unable to estimate thermal path.";
  if (rthJaRequired <= 5) return "Needs strong heatsink or forced airflow.";
  if (rthJaRequired <= 10) return "Use a medium heatsink.";
  if (rthJaRequired <= 20) return "Small clip-on heatsink or copper area is typically enough.";
  return "Often manageable with package + PCB copper only.";
};

const calculateTransistorResistor = () => {
  const vDrive = toNumber("tr-vdrive");
  const vBe = toNumber("tr-vbe");
  const icmA = toNumber("tr-ic");
  const betaForced = toNumber("tr-beta");
  if ([vDrive, vBe, icmA, betaForced].some((x) => x === null || x <= 0)) {
    setResult("tr-result", "Enter valid values greater than zero.", true);
    return;
  }
  if (vBe >= vDrive) {
    setResult("tr-result", "Drive voltage must be greater than Vbe.", true);
    return;
  }
  const ic = icmA / 1000;
  const ib = ic / betaForced;
  const rb = (vDrive - vBe) / ib;
  const pr = ib * (vDrive - vBe);
  const rbE12 = nearestE12(rb);
  setResult(
    "tr-result",
    `Ib = ${fmt(ib, "A")} | Rb = ${fmt(rb, "ohm")} | E12 ~ ${fmt(rbE12 || rb, "ohm")} | Resistor power >= ${fmt(pr * 2, "W")}`
  );
};

const calculateLinearRegulator = () => {
  const vin = toNumber("lreg-vin");
  const vout = toNumber("lreg-vout");
  const ioutmA = toNumber("lreg-iout");
  const dropout = toNumber("lreg-drop");
  const ta = toNumber("lreg-ta");
  const tj = toNumber("lreg-tj");

  if ([vin, vout, ioutmA, dropout, tj].some((x) => x === null || x <= 0) || ta === null) {
    setResult("lreg-result", "Enter valid numeric values in all fields.", true);
    return;
  }
  if (vin <= vout) {
    setResult("lreg-result", "Input voltage must be greater than output voltage.", true);
    return;
  }
  if (tj <= ta + 5) {
    setResult("lreg-result", "Max junction temp should be at least 5 degC above ambient.", true);
    return;
  }

  const iout = ioutmA / 1000;
  const headroom = vin - vout;
  const pReg = headroom * iout;
  const pOut = vout * iout;
  const pIn = vin * iout;
  const efficiency = (pOut / pIn) * 100;
  const rthJaReq = pReg > 0 ? (tj - ta) / pReg : Number.POSITIVE_INFINITY;
  const capBulkUf = Math.max(10, Math.round(iout * 100));
  const sinkHint = transistorHeatsinkHint(rthJaReq);

  const message = [
    `Headroom = ${fmt(headroom, "V")} | Regulator dissipation = ${fmt(pReg, "W")}`,
    `Efficiency ~ ${fmtNumber(efficiency, 2)}%`,
    `Required total thermal path thetaJA <= ${fmt(rthJaReq, "degC/W")}`,
    `Capacitors: Cin >= 0.33 uF, Cout >= 0.1 uF, add ~${capBulkUf} uF bulk`,
    `Heatsink guidance: ${sinkHint}`
  ].join("\n");

  if (headroom < dropout) {
    setResult("lreg-result", `${message}\nWarning: dropout margin not met for regulation.`, true);
    return;
  }
  setResult("lreg-result", message);
};

const calculateZenerRegulator = () => {
  const vin = toNumber("z-vin");
  const vz = toNumber("z-vz");
  const iloadmA = toNumber("z-iload");
  const izMinmA = toNumber("z-izmin");
  const izMaxmA = toNumber("z-izmax");
  if ([vin, vz, iloadmA, izMinmA, izMaxmA].some((x) => x === null || x <= 0)) {
    setResult("z-result", "Enter values greater than zero.", true);
    return;
  }
  if (vin <= vz) {
    setResult("z-result", "Input voltage must be greater than zener voltage.", true);
    return;
  }
  if (izMaxmA <= izMinmA) {
    setResult("z-result", "Zener max current must be greater than zener min current.", true);
    return;
  }

  const iload = iloadmA / 1000;
  const izMin = izMinmA / 1000;
  const izMax = izMaxmA / 1000;
  const rs = (vin - vz) / (iload + izMin);
  const rsE12 = nearestE12(rs);
  const iSource = (vin - vz) / rs;
  const izNoLoad = iSource;
  const izAtLoad = iSource - iload;
  const pzNoLoad = vz * izNoLoad;
  const pr = ((vin - vz) ** 2) / rs;

  const warn = izNoLoad > izMax
    ? `\nWarning: no-load zener current ${fmt(izNoLoad, "A")} exceeds max ${fmt(izMax, "A")}.`
    : "";

  setResult(
    "z-result",
    `Rs = ${fmt(rs, "ohm")} | E12 ~ ${fmt(rsE12 || rs, "ohm")}\nIz@load ~ ${fmt(izAtLoad, "A")} | Iz@no-load ~ ${fmt(izNoLoad, "A")}\nZener power >= ${fmt(pzNoLoad * 2, "W")} | Resistor power >= ${fmt(pr * 2, "W")}${warn}`,
    Boolean(warn)
  );
};

const calculateLedStringResistor = () => {
  const vs = toNumber("leds-vs");
  const vf = toNumber("leds-vf");
  const countRaw = toNumber("leds-count");
  const currentmA = toNumber("leds-current");
  if ([vs, vf, countRaw, currentmA].some((x) => x === null || x <= 0)) {
    setResult("leds-result", "Enter values greater than zero.", true);
    return;
  }

  const count = Math.max(1, Math.round(countRaw));
  const i = currentmA / 1000;
  const totalVf = vf * count;
  if (totalVf >= vs) {
    setResult("leds-result", "Supply voltage must be higher than total LED forward voltage.", true);
    return;
  }
  const r = (vs - totalVf) / i;
  const rE12 = nearestE12(r);
  const pr = (vs - totalVf) * i;
  const pled = totalVf * i;
  setResult(
    "leds-result",
    `Total Vf = ${fmt(totalVf, "V")} (${count} LEDs) | R = ${fmt(r, "ohm")} | E12 ~ ${fmt(rE12 || r, "ohm")}\nResistor power >= ${fmt(pr * 2, "W")} | LED string power ~ ${fmt(pled, "W")}`
  );
};

const calculateRC = () => {
  const r = toNumber("rc-r");
  const cUf = toNumber("rc-c");
  if ([r, cUf].some((x) => x === null || x <= 0)) {
    setResult("rc-result", "Enter positive R and C.", true);
    return;
  }
  const c = cUf * 1e-6;
  const tau = r * c;
  const fc = 1 / (2 * Math.PI * tau);
  setResult("rc-result", `tau = ${fmt(tau, "s")} | fc ~ ${fmt(fc, "Hz")}`);
};

const calculateReactance = () => {
  const type = document.getElementById("x-type").value;
  const f = toNumber("x-freq");
  const component = toNumber("x-value");
  if ([f, component].some((x) => x === null || x <= 0)) {
    setResult("x-result", "Enter positive values for frequency and component.", true);
    return;
  }
  let x;
  if (type === "capacitive") {
    const c = component * 1e-6;
    x = 1 / (2 * Math.PI * f * c);
    setResult("x-result", `Xc = ${fmt(x, "ohm")}`);
    return;
  }
  const l = component * 1e-3;
  x = 2 * Math.PI * f * l;
  setResult("x-result", `Xl = ${fmt(x, "ohm")}`);
};

const getResistorMode = () => document.getElementById("r-mode")?.value || "4";

const fillResistorSelect = (id, values, defaultIndex = 0) => {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = "";
  values.forEach((item) => {
    const opt = document.createElement("option");
    opt.textContent = item.label || item.name;
    opt.value = String(item.value);
    opt.dataset.color = item.color || "#ffffff";
    opt.dataset.text = item.text || "#162744";
    if (item.none) opt.dataset.none = "1";
    select.append(opt);
  });
  if (select.options.length > 0) {
    select.selectedIndex = Math.min(Math.max(defaultIndex, 0), select.options.length - 1);
  }
};

const setResistorSelectVisual = (id) => {
  const select = document.getElementById(id);
  if (!select || select.options.length === 0) return;
  const opt = select.options[select.selectedIndex];
  const color = opt.dataset.color || "#ffffff";
  const text = opt.dataset.text || "#142033";
  select.style.background = `linear-gradient(0deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2)), ${color}`;
  select.style.color = text;
};

const updateResistorModeUI = () => {
  const mode = getResistorMode();
  const band3Row = document.getElementById("r-band3-row");
  const tempcoRow = document.getElementById("r-tempco-row");
  if (band3Row) band3Row.classList.toggle("is-hidden", mode === "4");
  if (tempcoRow) tempcoRow.classList.toggle("is-hidden", mode !== "6");
};

const getResistorBandMeta = (id) => {
  const select = document.getElementById(id);
  if (!select || select.options.length === 0) {
    return { color: "#cccccc", none: false };
  }
  const opt = select.options[select.selectedIndex];
  return {
    color: opt.dataset.color || "#cccccc",
    none: opt.dataset.none === "1"
  };
};

const renderResistorPreview = () => {
  const body = document.getElementById("r-body-bands");
  if (!body) return;

  const mode = getResistorMode();
  const bands = [
    { role: "digit", ...getResistorBandMeta("r-band1") },
    { role: "digit", ...getResistorBandMeta("r-band2") }
  ];

  if (mode !== "4") {
    bands.push({ role: "digit", ...getResistorBandMeta("r-band3") });
  }

  bands.push({ role: "multiplier", ...getResistorBandMeta("r-mult") });
  bands.push({ role: "tolerance", ...getResistorBandMeta("r-tol") });

  if (mode === "6") {
    bands.push({ role: "tempco", ...getResistorBandMeta("r-tempco") });
  }

  body.innerHTML = "";
  bands.forEach((band) => {
    const el = document.createElement("span");
    el.className = "resistor-band";
    if (band.role === "tolerance") el.classList.add("is-tolerance");
    if (band.role === "tempco") el.classList.add("is-tempco");
    if (band.none) el.classList.add("is-none");
    el.style.background = band.color;
    body.append(el);
  });
};

const decodeResistor = () => {
  const mode = getResistorMode();
  const b1 = Number(document.getElementById("r-band1").value);
  const b2 = Number(document.getElementById("r-band2").value);
  const b3 = Number(document.getElementById("r-band3").value);
  const mult = Number(document.getElementById("r-mult").value);
  const tol = Number(document.getElementById("r-tol").value);
  const tempco = Number(document.getElementById("r-tempco").value);

  if (![b1, b2, mult, tol].every((x) => Number.isFinite(x))) {
    setResult("r-result", "Select valid color bands.", true);
    return;
  }
  if (mode !== "4" && !Number.isFinite(b3)) {
    setResult("r-result", "Select a valid third digit band.", true);
    return;
  }

  const sig = mode === "4" ? (b1 * 10 + b2) : (b1 * 100 + b2 * 10 + b3);
  const resistance = sig * mult;
  const minRes = resistance * (1 - tol / 100);
  const maxRes = resistance * (1 + tol / 100);
  let message = `${fmt(resistance, "ohm")} +/-${tol}% | Range: ${fmt(minRes, "ohm")} to ${fmt(maxRes, "ohm")}`;

  if (mode === "6") {
    if (!Number.isFinite(tempco)) {
      setResult("r-result", "Select a valid tempco band.", true);
      return;
    }
    message += ` | Tempco: ${tempco} ppm/degC`;
  }

  setResult("r-result", message);
  renderResistorPreview();
};

const initResistorDecoder = () => {
  fillResistorSelect("r-band1", digits, 1);
  fillResistorSelect("r-band2", digits, 0);
  fillResistorSelect("r-band3", digits, 0);
  fillResistorSelect("r-mult", multipliers, 4);
  fillResistorSelect("r-tol", tolerances, 6);
  fillResistorSelect("r-tempco", tempcos, 1);

  const ids = ["r-band1", "r-band2", "r-band3", "r-mult", "r-tol", "r-tempco"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setResistorSelectVisual(id);
    el.addEventListener("change", () => {
      setResistorSelectVisual(id);
      renderResistorPreview();
      decodeResistor();
    });
  });

  const modeSelect = document.getElementById("r-mode");
  if (modeSelect) {
    modeSelect.addEventListener("change", () => {
      updateResistorModeUI();
      renderResistorPreview();
      decodeResistor();
    });
  }

  updateResistorModeUI();
  renderResistorPreview();
};

const init = () => {
  initResistorDecoder();

  initMainTabs();
  initTopologyTabs();

  document.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "ohms") calculateOhmsLaw();
      if (action === "divider") calculateDivider();
      if (action === "led") calculateLedResistor();
      if (action === "transistor") calculateTransistorResistor();
      if (action === "lreg") calculateLinearRegulator();
      if (action === "zener") calculateZenerRegulator();
      if (action === "led-string") calculateLedStringResistor();
      if (action === "rc") calculateRC();
      if (action === "reactance") calculateReactance();
      if (action === "resistor") decodeResistor();
      if (action === "dcdc-calc") runDcdcCalculation(btn.dataset.topology);
      if (action === "dcdc-pdf") downloadDcdcReport(btn.dataset.topology);
    });
  });

  Object.keys(dcdcConfigs).forEach((topology) => runDcdcCalculation(topology));
  decodeResistor();
};

init();
