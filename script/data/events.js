import { addNavigationAttention } from "../toggleUIElement.js";

const events = {
    "Batteries": {
        script: [
            {
                text: "With the familiar sound of landing in the middle of a vast plain, you land in the middle of a vast plain."
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
                text: "You took apart the wind turbine and gained 10 dust.",
                item: {
                    dust: 10,
                },
                endEvent: true,
                eventResolved: true,
            },
            {
                text: "You let the turbine generate energy for a while. You gain 100 energy.",
                item: {
                    energy: 100,
                },
                endEvent: true,
                eventResolved: true,
            }
        ]
    },
    "Asteroid": {
        script: [
            {
                text: "Before you even reach the planet, you find an asteroid floating around in space."
            },
            {
                text: "Although the asteroid seems boring, consider this: it also has a very funny shape. In fact, its shape is so funny it cannot be descrbied here. Just trust that it is very funny."
            },
            {
                text: "You spent so long looking at the asteroid you forgot something: you're running out of fuel. Better go back.",
                eventResolved: true,
            }
        ]
    },
    "Battery": {
        script: [
            {
                text: "You are flying around in your spaceship as one does. You land as one does. You're pretty used to doing this by now."
            },
            {
                text: "As you land, you find a battery. It says 'AA'. The letters seem to remind you of a familiar yet distant reality."
            },
            {
                text: "You quickly snap out of the delusion. No, there is no distant reality. This is what you have always been doing. Flying around in your spaceship and collecting energy."
            },
            {
                text: "You can gain 50 energy from this battery. Better focus on that instead of whatever else you are thinking.",
                item: {
                    energy: 50
                },
                eventResolved: true
            }
        ]
    },
    "Research Station": {
        script: [
            {
                text: "Your ship flies over a research station."
            },
            {
                text: "Do you want to go and land at the research station? It might have something useful lying around.",
                choice: [
                    {
                        text: "Yes",
                        goto: 3
                    },
                    {
                        text: "No",
                        goto: 2
                    }
                ]
            },
            {
                text: "You flew over the research station and literally nothing else happened.",
                eventResolved: true,
                endEvent: true,
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
                },
            },
            {
                text: "You leave the research station.",
                eventResolved: true,
            }
        ]
    },
    "literallyJustGetMetal": {
        script: [
            {
                text: "You flew down to the planet you gained 5 metal. That's literally it. Nothing else happened. Who put the metal there? No one cares. All you care about is that you gained 5 metal.",
                item: {
                    metal: 5
                },
                eventResolved: true
            }
        ]
    },
    "Warp Drive": {
        script: [
            {
                text: "You arrive at the planet, but before landing, a large orbital station glimmering in the white starlight catches your attention."
            },
            {
                text: "You pull up next to the station, but the landing bay is broken and requires 5 iridium to fix.",
                choice: [
                    {
                        text: "Fix it",
                        cost: {
                            iridium: 5
                        },
                        goto: 2,
                    },
                    {
                        text: "Leave",
                        goto: 4
                    }
                ]
            },
            {
                text: "You fixed the station, but you still need energy to get the station doors to open.",
                choice: [
                    {
                        text: "Supply energy",
                        cost: {
                            energy: 100
                        },
                        goto: 3
                    },
                    {
                        text: "Leave",
                        goto: 4
                    }
                ]
            },
            {
                text: "Success! You manage to enter the research station, and inside, you find the blueprints for a warp drive. Perhaps you can jump between star systems with this?",
                researchUnlocked: ["Warp Drive"],
                endEvent: true,
                eventResolved: true
            },
            {
                text: "You leave the station for another day.",
                endEvent: true,
                eventResolved: false,
            }
        ]
    },
    "Harvest Sand": {
        script: [
            {
                text: "Your ship flies over vast sand dunes reflecting the glimmer of starlight, before landing."
            },
            {
                text: "Mixed in the vast sand dunes are some bits of dust. You gained 50 dust.",
                item: {
                    dust: 50
                }
            },
            {
                text: "You wonder who left the bits of dust there for you. Perhaps a traveller from a distant land?",
                eventResolved: true
            }
        ]
    },
    "unlockTurrets": {
        script: [
            {
                text: "You emerge from the clouds looking down the barrel of a gun. A big gun, at that. One big enough that you can fly your ship through it."
            },
            {
                text: "Fortunately, you don't see any other living being around, and the gun has certainly seen better days."
            },
            {
                text: "Still, you wonder if you can make your own... It could help deal with hostiles in your area.",
                endEvent: true,
                eventResolved: true,
                researchUnlocked: ["turret"]
            }
        ]
    },
    "solarPanels1": {
        script: [
            {
                text: "The turbulence weakens as your ship breaks through the bottom layer of clouds. In front of you, you see an ocean reaching out to the distant skies above, waves reflecting the gentle droplets of sunshine raining down from the heavens."
            },
            {
                text: "And, as your ship descends further and further, you begin to make out patches of greenery among the waves — patches of island among the endless water."
            },
            {
                text: "The scenery offers a pleasing and transquil view, but you wonder if that's all the planet has in store for you. Then, out of the corner of your eye, a fleeting reflection of sunlight catches your attention."
            },
            {
                text: "You steer your ship towards the light. It leads you to an island like many others, except for one small detail: a large solar panel feeding power to a small white lab. You don't know what the building is used for, but you do know: you can use the solar panel to power your ship.",
                item: {
                    solarPanel: 1
                }
            },
            {
                text: "Solar panels are difficult to come by in this universe. Better look after this one; it will serve you well.",
                eventResolved: true
            }
        ]
    },
    "solarPanels2": {
        script: [
            {
                text: "The golden sands of this planet sang ancient melodies lost to time. Of course, you're not here to listen."
            },
            {
                text: "Your goal is kind of to plunder anything that could be remotely of use to you on this planet."
            },
            {
                text: "..."
            },
            {
                text: "And it appears the heavens has answered your calls to gluttony, greed, and selfishness! For in the distance, you find the familar glow of a solar panel."
            },
            {
                text: "Of course, since you're here to plunder, and there is an object to be plundered in the distance, you decide to just go for it."
            },
            {
                text: "That's the story of how you added another solar panel to your collection. 100% Legal Piracy!",
                item: {
                    solarPanel: 1
                },
                eventResolved: true
            }
        ]
    },
    "deflectionDriveUnlock": {
        script: [
            {
                text: "Again your ship descends into the atmosphere and flies over the distant land. You've done this quite a few times now."
            },
            {
                text: "You've been to quite a few planets, maybe even jumped to a new system. However, you ponder if it's possible to go to... more solar systems. You know, those your drive can't yet seem to reach."
            },
            {
                text: "And, as if the heavens are answering your calls, a large ship clearly wounded from battle falls limpedly out of the sky."
            },
            {
                text: "Its body covered in ablazing flames, a large hole shows the sky hiding behind its wings, you follow the intense trail of red."
            },
            {
                text: "By the time the ship fell to the ground, the flames were extingushed. You search for signs of life but don't find any."
            },
            {
                text: "However, you were able to discover something interesting among the wreckage. A strange device which appears to protect the ship it's attached to. Researching it should let you go to more places.",
            },
            {
                text: "You also managed to scavenge some metal from the wreckage.",
                item: {
                    metal: 5
                }
            },
            {
                text: "You fly back to your ship with metal and the strange device. You think the situation is almost too convenient for you, but you don't complain.",
                researchUnlocked: ["deflectionDrive"],
                eventResolved: true
            }
        ]
    },
    "fasterShips": {
        script: [
            {
                text: "After a long and arduous journey down to {PLANETNAME}, you realise you need significantly better and faster engines."
            },
            {
                text: "After all, we all want to try to get to planets faster and outrun hostiles. You don't really want to wait 3 years to do that."
            },
            {
                text: "You don't even bother flying down; you immediately flew back to the mothership to research better propulsion.",
                eventResolved: true,
                researchUnlocked: ["engineUpgrades"]
            }
        ]
    },
    "unlockRadar": {
        script: [
            {
                text: "As you fly down towards the ground, you see a large radar station pointed towards your ship. Of course it's gathering literally every bit of information about your ship."
            },
            {
                text: "You decide to quickly get out before they send swarms of enemies your way. Not today!"
            },
            {
                text: "However, you do remember what the radar looks like, and you wonder if you can make your own...",
                researchUnlocked: ["radar"],
                eventResolved: true
            }
        ]
    },
    "unlockFabribot": {
        script: [
            {
                text: "As you fly towards the planet, you see a sea of silver reflected in the sunlight. Large interconnected steel buildings cover half of the planet's surface."
            },
            {
                text: "You emerge from the clouds after a short while. You expect this to be a busy industrial planet with ships and people bustling about, but there is nothing. Only machines carrying out the commands of a civilisation long left behind."
            },
            {
                text: "You land on top of such building. It looks exactly the same as the ones stretching on for miles on end. You walk inside and discover a robot using a large compressor plate to turn dust into metal."
            },
            {
                text: "No one responded to your radio calls, so will anyone miss it when it's gone?. Such a machine could certainly prove useful for your base, if you could understand how to use it."
            },
            {
                text: "It is very tight, but the robot just looks like it would fit inside your spaceship. You'll just have to get your research computer to figure out how to send instructions to this thing.",
                researchUnlocked: ["fabriBot"]
            },
            {
                text: "There are some metal and dust lying around the factory. If you've already taken the big robot, then you might as well as take them."
            },
            {
                text: "Take the metal and dust?",
                choice: [
                    {
                        text: "Yes",
                        goto: 7
                    },
                    {
                        text: "No",
                        goto: 8
                    }
                ]
            },
            {
                text: "Well, no one will miss them, or even notice that they're missing.",
                item: {
                    dust: 15,
                    metal: 5
                }
            },
            {
                text: "You leave the planet.",
                eventResolved: true
            }
        ]
    },
    "cloakingDevice": {
        script: [
            {
                text: "As you break through the clouds, you are confronted with a tower reaching for the skies. You barely managed to weave around it."
            },
            {
                text: "You bring your ship to land right outside the tower, right next to a small black door barely visible on the outside."
            },
            {
                text: "The tower look like it has been inactive for as long as the time flows. You need to supply energy to get the door to open.",
                choice: [
                    {
                        text: "Supply energy",
                        cost: {
                            energy: 500
                        },
                        goto: 4
                    },
                    {
                        text: "Leave",
                        goto: 3
                    }
                ]
            },
            {
                text: "You leave the tower for another day.",
                eventResolved: false,
                endEvent: true,
            },
            {
                text: "The doors open to reveal a bright white room. The moment you walk through the doors, you suddenly run into an invisible wall."
            },
            {
                text: "The little amount of power you supplied appear to be used up. The lights suddenly dim and, in front of you, you see a massive mechanical contraption."
            },
            {
                text: "It must be a cloaking device. You decide to take it with you back to your mothership. It would be useful in evading hostiles.",
                eventResolved: true,
                researchUnlocked: ["cloakingDevice"]
            }
        ]
    },
    "scanner": {
        script: [
            {
                text: "Beep. Boop. Beep. Boop. As your ship flies closer and closer towards the surface, you listen to the rhythmic repeats of a strange sound."
            },
            {
                text: "You found the source: a very large scanner visible beyond the cockpit of your ship."
            },
            {
                text: "The scanner doesn't seem to be do anything. But strangely, you continue to hear the rhythmic beeping and booping as if your ship was a blip picked up by the scanner."
            },
            {
                text: "As you get closer to the source, you can make out a large sign: \"ScannerCon: Who Can Make The Best Scanners?\"."
            },
            {
                text: "And, underneath the sign, you find two large pairs of speakers alternating between making beeping and booping sounds."
            },
            {
                text: "Well, those speakers are just wasting their energy. You decide to take their batteries.",
                item: {
                    energy: 750
                }
            },
            {
                text: "Next to the speakers, you find a blueprint of the scanner. Better take that as well.",
                researchUnlocked: ["scanner"]
            },
            {
                text: "You leave the planet with newfound energy and knowledge on how to scan enemy ships."
            },
            {
                text: "Once you research and build the scanner, you will finally be able to gain more insight on enemy ships.",
                eventResolved: true
            }
        ]
    },
    "palmTree": {
        script: [
            {
                text: "{STARNAME} hangs suspended in the post-noon sky, coating the planet in a shiny golden glow."
            },
            {
                text: "Endless grass and hills stretch on as far as your gaze can follow, but a single tree hangs alone in the distance."
            },
            {
                text: "It is a palm tree standing high and proud against the tide of photons, its leaves ornate in the wind."
            },
            {
                text: "Carefully, you land your {SHIPCLASS} beside the tree. The leaves shake with your throttle."
            },
            {
                text: "The clouds are clear on this special day. You and your ship feel just like the palm tree: a force of rebellion against the otherwise serene landscape."
            },
            {
                text: "The audacity of the tree gives you inspiration. You gained some research points.",
                item: {
                    researchPoints: 3
                },
                eventResolved: true
            }
        ],
    },
    "ancientPonderer": {
        script: [
            {
                text: "The boundless oceans of the planet cover up the secrets that lie below, their waters a mirror of the skies above."
            },
            {
                text: "However, you found a secret the oceans do not cover up. It's a massive monolith reaching up to the sky directly in front of you."
            },
            {
                text: "So far, everything you have encountered on your adventure has been abandoned, and this monolith is no exception."
            },
            {
                text: "Scans from your {SHIPCLASS} indicate the monolith is an computer bestowed with the name Ancient Ponderer."
            },
            {
                text: "The secrets contained within could be of use to you, and you have a lot to learn from Ancient Ponderer."
            },
            {
                text: "You connect your {SHIPCLASS} to the mainframe. Surprisingly, everything went smoothly; the makers of Ancient Ponderer should at least know better than to put no firewall on their supercomputer."
            },
            {
                text: "But, still, it's convinent for you. You don't complain."
            },
            {
                text: "You gained 3 research points and learnt the art of efficent pondering! Your computer will generate research points faster.",
                script(shipData, userData) {
                    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
                    currentMultiverse.ticksPerResearchAdvancement -= 5;
                    addNavigationAttention("Research", "pageResearch");
                },
                item: {
                    researchPoints: 3
                },
                eventResolved: true
            }
        ]
    },
    story1: {
        script: [
            {
                text: "This is your tenth descent below the blanket of clouds. You've hit double digits already. You again feel the familar vibrations of your ship as it hurls into the depths of the unknown.",
            },
            {
                text: "You appreciate the sublimity of the clouds coated in the golden glow of the sun. In between the glowing streaks from your ship, the horizon is coated in the gold of its distant star.",
            },
            {
                text: "The scenery envelop you in transquility, and, as your ship slowly floats down towards the surface, you mind begins to drift to far away places.",
            },
            {
                text: "Your mind's eye sees a universe far larger, a place where there are not hundreds of stars, but billions. And it in, you are on a blue marble around a star. It's your star.",
            },
            {
                text: "And, of course, there are more like you. A place where billions of individuals like you move about from place to place in their day to day work, the hustle and bustle of their conversations whispering to you as they pass by. Must be wonderful being caught in the moment.",
            },
            {
                text: "At this moment, a sudden alarm takes you out of your thoughts. LANDING GEAR FAILURE. Looks like this expedition has to end early.",
            },
            {
                text: "As you pull up, you again take your mind to the distant world, a world hidden behind the shrouds of darkened glass in your mind. You picture yourself standing in the centre, where vast systems formed into galaxies whirl past you, leaving behind naught but a memory.",
            },
            {
                text: "But does that place ever exist? You consider as you fly away.",
            },
        ]
    },
    story2: {
        script: [
            {
                text: "From high above the atmosphere, you send your lilliputian craft into the depths. It's night on this side of the planet. Better be careful, you think to yourself. The red trails of your ship lights up the sky, but, in front of you, there is only an empty void.",
            },
            {
                text: "Again you cast your mind to the distant universe. Does it really exist? And if it does, what's in the distant universe? Is it simply a realm of daydreams, or does it really exist beyond the confines of your mind?",
            },
            {
                text: "You try to probe your head for details relating to the universe. Accompanied by the rattle of your spaceship, you push deeper into the abyss of the mind. And, you find three words staring back at you.",
            },
            {
                text: "\"Impending Energy Calamity.\"",
            },
        ]
    },
    story3: {
        script: [
            {
                text: "It doesn't take a genius to figure out that the \"Impending Energy Calamity\" is, in fact, a very bad thing. Well, judging by the fact that you're alive and currently piloting a spaceship at eight kilometers per second down into the atmosphere of a strange new planet, you figured you probably survived the worse of it.",
            },
            {
                text: "Of course, it is only natural now to wonder what the Impending Energy Calamity is. Suddenly, as if imparted by an entity beyond this universe, visions of that same distant world appear in your mind, its radiance blocking out the vast lands below.",
            },
            {
                text: "Blades of the green populate an open plain as you stand in the darkness. When you gaze to the night sky above, you see the light from billions of stars  lighting up your world. It is as if a dream was reflected through the lens of the real.",
            },
            {
                text: "The world between dream and nightmare blurs as a light above was extingushed by a force not known, the emptiness a reflection of a reality where it never existed.",
            },
            {
                text: "Then, in a distant corner, another light darkens. Then another, and another, and another. It doesn't stop. Another one's gone. And another star. The one that glew the brightest is gone, and so is the one that's the dimmest. The biggest disappeared, and so did the smallest.",
            },
            {
                text: "It keeps going. Soon, you are greeted by nothing but a pitch black sky and the audible echoes within your soul.",
            },
            {
                text: "Your mind snaps back to the ever-shifting present, a reality where your feeble spaceship is about to cross the boundries between worlds. You gaze at the skies above; the stars wave at you as if they were never gone.",
            },
        ]
    },
    story4: {
        script: [
            {
                text: "You awaken to the essence of nothingness; the world painted with the soul of oblivion and the silence of the night. The grass plain reduced from a mirror for the expression of the night sky to an apathetic maiden watching the world go by.",
            },
            {
                text: "And you, a mere mortal witnessing the affair of the divine, left alone in the aphotic without a guidepost, patiently waiting for the sunrise of a new dawn to lead you away.",
            },
            {
                text: "But that sunrise never came.",
            },
        ]
    },
    story5: {
        script: [
            {
                text: "Yet, human ingenuity persists in the tide of change, for despite the odds against us, we adapted. We may not be able to restore the stars, but we will not give up. We coordinated and talked. We built our own suns, fusion reactors consuming swarms of hydrogen to light up the sky, their faint and distant glow a pathetic yet faithful mimicry of Sol.",
            },
            {
                text: "We would turn them on and off to recreate the eternal cycle of day and night. We would suspend them from the clouds like the Old Sun. They provided guidance both for the distant and weary traveller and for the city dweller. Thus, there is again light in the world.",
            },
            {
                text: "We reached for the night sky. The most brilliant scientists gathered to solve the puzzle of the darkness. We sent out probes; we sent out spaceships. Even then, the collective intelligence cannot solve the story of the stars.",
            },
            {
                text: "Even then, we would live on in our new fake reality, our days marked by the little suns above. It is as if the old God was always there.",
            },
            {
                text: "But, in the back of everyone's minds lies a lingering monster no one wishes to confront directly, a monster reminding us we will run out of hydrogen. We will run out of energy. And when that happens, the world will again return to darkness.",
            },
        ]
    },
}

export default events;