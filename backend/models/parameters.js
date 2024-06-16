const ParametersSchema = {
    "dynamic_defekt_proportion_thresholds": {
        "greening": { type: "number", min: 0, max: 1 },
        "dry_rot": { type: "number", min: 0, max: 1 },
        "wet_rot": { type: "number", min: 0, max: 1 },
        "wire_worm": { type: "number", min: 0, max: 1 },
        "malformed": { type: "number", min: 0, max: 1 },
        "growth_crack": { type: "number", min: 0, max: 1 },
        "mechanical_damage": { type: "number", min: 0, max: 1 },
        "dirt_clod": { type: "number", min: 0, max: 1 },
        "stone": { type: "number", min: 0, max: 1 }
    },
};

module.exports = ParametersSchema;