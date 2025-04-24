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
                text: "You leave the research station",
                eventResolved: true,
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
                text: "You wonder who left the bits of dust there for you.",
                eventResolved: true
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
    "unlockRadar": {
        script: [
            {
                text: "As you fly down towards the ground, you see a large radar station pointed towards your ship. Of course it's gathering intel about your ship."
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
                text: "You emerge from the clouds after a short well. You expect this to be a busy industrial planet with ships and people bustling about, but there is nothing. Only machines carrying out the commands of a civilisation long left behind."
            },
            {
                text: "You land on top of such building. It looks exactly the same as the ones stretching on for miles on end. You walk inside and discover a robot using a large compressor plate to turn dust into metal."
            },
            {
                text: "No one responded to your radio calls, so there is clearly no one there. Such a machine could certainly prove useful for your base, if you could understand how to use it."
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
                        goto: 8
                    },
                    {
                        text: "No",
                        goto: 9
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
    "story1": {
        script: [
            {
                text: "This is your tenth descent down into a planet. You've hit double digits already. You again feel the familar vibrations of the ship as it hurls into the depths of the atmosphere."
            },
            {
                text: "You appreciate the sublimity of the clouds coated in the golden glow of the sun. In between the glowing streaks from your ship, the horizon is coated in the goal of its distant star."
            },
            {
                text: "The scenery envelop you in transquility, and, as your ship slowly floats down towards the surface, you mind begins to drift to far away places."
            },
            {
                text: "You are taken back to a distant place, a universe far larger, a place where there are not hundreds of stars, but billions. And it in, you are on a blue marble around a star. It's your star."
            },
            {
                text: "And, of course, there are more like you. A place where billions of individuals like you move about from place to place in their day to day work, the hustle and bustle of their conversations whispering to you as they pass by. Must be wonderful being caught in the moment."
            },
            {
                text: "At this moment, a sudden alarm takes you out of your thoughts. LANDING GEAR FAILURE. Looks like this expedition has to end early."
            },
            {
                text: "As you pull up, you again take your mind to the distant world, a world hidden behind the shrouds of darkened glass in your mind. You picture yourself standing in the centre, where vast systems formed into galaxies whirl past you, leaving behind naught but a memory."
            },
            {
                text: "But does that place ever exist? You consider as you fly away."
            }
        ]
    },
    "story2": {
        script: [
            {
                text: "From high above the atmosphere, you send your lilliputian craft into the depths of darkness. It's night on this side of the planet. Better be careful, you think to yourself. The red trails of your ship lights up the sky, but, in front of you, there is only an empty void."
            },
            {
                text: "Again you cast your mind to the distant universe. Does it really exist? And if it does, what's in the distant universe? Is it simply a realm of daydreams, or does it really exist beyond the confines of your mind?"
            },
            {
                text: "You try to probe your head for details relating to the universe. Accompanied by the rattle of your spaceship, you push deeper into the abyss of the mind. And, you find two words staring back at your face \"Kinetic Labratories\"."
            },
            {
                text: "What could those words mean? You keep searching your mind for clues but nothing comes up. Then, out of the depths of darkness, you find three words staring you in the face."
            },
            {
                text: "\"Impending Energy Calamity.\""
            }
        ]
    },
    "story3": {
        script: [
            {
                text: "It doesn't take a genius to figure out that the \"Impending Energy Calamity\" is, in fact, a very bad thing. Well, judging by the fact that you're alive and currently piloting a spaceship at eight kilometers per second down into the atmosphere of a strange new planet, you figured you probably survived the worse of it."
            },
            {
                text: "Of course, it is only natural now to wonder what the Impending Energy Calamity is. And how does that relate to the mysterious words, \"Kinetic Labratories\"? Suddenly, visions of that same distant world appear in your mind, with enough intensity to block out the vast lands below your spaceship."
            },
            {
                text: 'You are standing on the top of the mountain in the darkness. When you gaze to the night sky above, you see the light from billions of stars from above lighting up your world. You bask in the transquility of the scene.'
            },
            {
                text: 'Suddenly, one of the lights just went ont. It was there a moment ago and now it\'s not. Then another, and another, and another.'
            },
            {
                text: "The terrors of billions of individual just like you fills the world. It doesn't stop. Another one's gone. And another star. The one that glew the brightest is gone, and so is the one that's the dimmest. The biggest disappeared, and so did the smallest."
            },
            {
                text: "It keeps going. Soon, you are greeted by nothing but a pitch black sky with nothing in the sky. The vibrant night sky was reduced to darkness."
            },
            {
                text: "You snap back to reality. You gaze at the skies above, and are fortunate to see the faint glow of stars in the sky. There are not as many stars as in your mind, but you are glad their light can still reach you."
            }
        ]
    }
}

export default events;