const events = {
    "Batteries": {
        script:[
            {
                text: "You land in the middle of a vast plain."
            },
            {
                text: "You come across a small abandoned building in a vast plain. There is a model wind turbine outside the building. You can take the wind turbine apart for dust, or let it generate energy. What do you do?",
                choice: [
                    {
                        text: "Take it apart",
                        goto: 2,
                    },
                    {
                        text: "Generate Energy",
                        goto: 3
                    }
                ]
            },
            {
                text: "You took apart the wind turbine and gained 30 dust.",
                item: {
                    dust: 30,
                },
                endEvent: true,
            },
            {
                text: "You let the turbine generate energy for a while. You gain 200 energy.",
                item: {
                    energy: 200,
                },
                endEvent: true
            }
            ]
    },
    "Research Station": {
        script: [
            {
                text: "The ship flies over a research station."
            },
            {
                text: "You found a hard drive lying around and gained a research point.",
                item: {
                    researchPoints: 1
                }
            },
            {
                probability: 0.5,
                text: "You also found the station's energy supplies, and gain 100 energy.",
                item: {
                    energy: 100
                }
            }
        ]
    }
}

export default events;