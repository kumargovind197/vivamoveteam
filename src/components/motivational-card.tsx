"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
    Footprints, Bike, PersonStanding, Waves, Dumbbell, HeartPulse, Fish, Apple, Carrot, BrainCircuit, 
    Leaf, Sprout, Award, Calendar, Check, ClipboardCheck, Clock, Flame, Grape, Heart, LifeBuoy, Map, 
    Mountain, Navigation, Rainbow, Rocket, Star, Sunrise, Sunset, Trophy, Users, Wind, Zap, Scale, 
    Stethoscope, Soup, Salad, GlassWater, Activity, Anchor, Aperture, Archive, ArrowDownCircle, 
    ArrowUpCircle, Asterisk, AtSign, Axe, Baby, BadgeCheck, Banana, BarChart, Bath, BatteryFull, 
    BatteryCharging, BedDouble, Beer, Bell, Blend, Bold, Bomb, Bone, Book, Bot, Box, Briefcase, 
    Brush, Bug, Building, Bus, Calculator, Camera, CandlestickChart, Castle, Cat, CheckCircle, 
    Cherry, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsDown, ChevronsLeft, 
    ChevronsRight, ChevronsUp, Church, Citrus, Clapperboard, Cloud, Clover, Code, Cog, Coins, 
    Compass, Computer, ConciergeBell, Cookie, Crown, CupSoda, Diamond, Disc, Dog, DollarSign, DoorClosed, 
    DoorOpen, Draft, Dribbble, Droplet, Drum, Ear, Egg, Euro, Eye, Fan, Feather, FerrisWheel, Figma, File,
    Film, Filter, Flag, Flower, Folder, Football, Forklift, Frame, Frown, Fuel, FunctionSquare, Gamepad2,
    Gauge, Gavel, Gem, Ghost, Gift, GitBranch, GitCommit, GitFork, GitMerge, GitPullRequest, Github,
    Gitlab, Globe, Grab, GraduationCap, Grid, Grip, Hammer, Hand, HandMetal, Hash, Haze, Heading,
    Headphones, HeartCrack, Heater, HelpCircle, Hexagon, Highlighter, History, Home, Hop, Hourglass,
    IceCream, Image, Inbox, Infinity, Info, Instagram, Italic, Key, Landmark, Languages, Laptop, Laugh,
    Layout, Library, Lightbulb, Link, Linkedin, List, Lock, LogIn, LogOut, Luggage, Magnet, Mail, Martini,
    Maximize, Medal, Megaphone, Menu, MessageCircle, MessageSquare, Mic, Minimize, Monitor, Moon, MoreHorizontal,
    Mouse, Move, Music, Newspaper, Nut, Option, Package, Palmtree, Paperclip, ParkingCircle, Pause,
    Pen, Pencil, Percent, Phone, PieChart, Pilcrow, Pin, Plane, Plug, Plus, Pocket, Podcast, Pointer,
    Power, Printer, Puzzle, Quote, Redo, RefreshCw, Reply, Rewind, RollerCoaster, RotateCcw, Rss, Ruler,
    Save, Scissors, ScreenShare, Search, Send, SeparatorHorizontal, Server, Settings, Share, Shield,
    ShoppingBag, ShoppingCart, Shrub, Shuffle, Sidebar, Signal, Smartphone, Smile, Speaker, Spline,
    Square, Sticker, Sun, Swords, Tablet, Tag, Target as TargetIcon, Tent, Terminal, ThumbsDown, ThumbsUp,
    Ticket, Timer, ToggleLeft, ToggleRight, Train, Trash, TreePine, TrendingDown, TrendingUp,
    Triangle, Truck, Twitter, Type, Umbrella, Underline, Unlink, Unlock, Upload, Usb, Video, Voicemail,
    Volume2, Wallet, Watch, Webcam, Wifi, Wine, WrapText, Wrench, Youtube, ZoomIn, ZoomOut
} from "lucide-react";


interface MotivationalCardProps {
    steps: number | null;
}

const icons = [
    { icon: <PersonStanding className="h-10 w-10" />, name: "Walking" },
    { icon: <Bike className="h-10 w-10" />, name: "Cycling" },
    { icon: <Waves className="h-10 w-10" />, name: "Swimming" },
    { icon: <Dumbbell className="h-10 w-10" />, name: "Strength" },
    { icon: <HeartPulse className="h-10 w-10" />, name: "Wellness" },
    { icon: <Fish className="h-10 w-10" />, name: "Healthy Food" },
    { icon: <Apple className="h-10 w-10" />, name: "Eat Well" },
    { icon: <Carrot className="h-10 w-10" />, name: "Vitamins" },
    { icon: <BrainCircuit className="h-10 w-10" />, name: "Mindfulness" },
    { icon: <Leaf className="h-10 w-10" />, name: "Nature" },
    { icon: <Sprout className="h-10 w-10" />, name: "Growth" },
    { icon: <Award className="h-10 w-10" />, name: "Goals" },
    { icon: <Calendar className="h-10 w-10" />, name: "Consistency" },
    { icon: <Check className="h-10 w-10" />, name: "Done" },
    { icon: <ClipboardCheck className="h-10 w-10" />, name: "Tracked" },
    { icon: <Clock className="h-10 w-10" />, name: "On Time" },
    { icon: <Flame className="h-10 w-10" />, name: "Calories" },
    { icon: <Footprints className="h-10 w-10" />, name: "Steps" },
    { icon: <Grape className="h-10 w-10" />, name: "Fruits" },
    { icon: <Heart className="h-10 w-10" />, name: "Love" },
    { icon: <LifeBuoy className="h-10 w-10" />, name: "Support" },
    { icon: <Map className="h-10 w-10" />, name: "Explore" },
    { icon: <Mountain className="h-10 w-10" />, name: "Adventure" },
    { icon: <Navigation className="h-10 w-10" />, name: "Direction" },
    { icon: <Rainbow className="h-10 w-10" />, name: "Positivity" },
    { icon: <Rocket className="h-10 w-10" />, name: "Boost" },
    { icon: <Star className="h-10 w-10" />, name: "Shine" },
    { icon: <Sunrise className="h-10 w-10" />, name: "Morning" },
    { icon: <Sunset className="h-10 w-10" />, name: "Evening" },
    { icon: <Trophy className="h-10 w-10" />, name: "Victory" },
    { icon: <Users className="h-10 w-10" />, name: "Community" },
    { icon: <Wind className="h-10 w-10" />, name: "Fresh Air" },
    { icon: <Zap className="h-10 w-10" />, name: "Energy" },
    { icon: <Scale className="h-10 w-10" />, name: "Balance" },
    { icon: <Stethoscope className="h-10 w-10" />, name: "Health" },
    { icon: <Soup className="h-10 w-10" />, name: "Nutrition" },
    { icon: <Salad className="h-10 w-10" />, name: "Greens" },
    { icon: <GlassWater className="h-10 w-10" />, name: "Hydrate" },
    { icon: <Activity className="h-10 w-10" />, name: "Activity" },
    { icon: <Anchor className="h-10 w-10" />, name: "Stability" },
    { icon: <Aperture className="h-10 w-10" />, name: "Focus" },
    { icon: <Axe className="h-10 w-10" />, name: "Chop" },
    { icon: <Baby className="h-10 w-10" />, name: "New Start" },
    { icon: <BadgeCheck className="h-10 w-10" />, name: "Verified" },
    { icon: <Banana className="h-10 w-10" />, name: "Potassium" },
    { icon: <BarChart className="h-10 w-10" />, name: "Stats" },
    { icon: <Bath className="h-10 w-10" />, name: "Relax" },
    { icon: <BatteryFull className="h-10 w-10" />, name: "Charged" },
    { icon: <BedDouble className="h-10 w-10" />, name: "Rest" },
    { icon: <Bell className="h-10 w-10" />, name: "Reminder" },
    { icon: <Blend className="h-10 w-10" />, name: "Smoothie" },
    { icon: <Bone className="h-10 w-10" />, name: "Strong" },
    { icon: <Book className="h-10 w-10" />, name: "Learn" },
    { icon: <Box className="h-10 w-10" />, name: "Foundation" },
    { icon: <Brush className="h-10 w-10" />, name: "Create" },
    { icon: <Building className="h-10 w-10" />, name: "Urban" },
    { icon: <Bus className="h-10 w-10" />, name: "Commute" },
    { icon: <Camera className="h-10 w-10" />, name: "Capture" },
    { icon: <CandlestickChart className="h-10 w-10" />, name: "Trends" },
    { icon: <Castle className="h-10 w-10" />, name: "Fortress" },
    { icon: <Cat className="h-10 w-10" />, name: "Stretch" },
    { icon: <CheckCircle className="h-10 w-10" />, name: "Complete" },
    { icon: <Cherry className="h-10 w-10" />, name: "Sweet" },
    { icon: <Church className="h-10 w-10" />, name: "Spirit" },
    { icon: <Citrus className="h-10 w-10" />, name: "Zest" },
    { icon: <Cloud className="h-10 w-10" />, name: "Dream" },
    { icon: <Clover className="h-10 w-10" />, name: "Luck" },
    { icon: <Cog className="h-10 w-10" />, name: "Process" },
    { icon: <Compass className="h-10 w-10" />, name: "Navigate" },
    { icon: <Computer className="h-10 w-10" />, name: "Work" },
    { icon: <Cookie className="h-10 w-10" />, name: "Treat" },
    { icon: <Crown className="h-10 w-10" />, name: "Champion" },
    { icon: <CupSoda className="h-10 w-10" />, name: "Refresh" },
    { icon: <Diamond className="h-10 w-10" />, name: "Value" },
    { icon: <Dog className="h-10 w-10" />, name: "Play" },
    { icon: <DoorOpen className="h-10 w-10" />, name: "Opportunity" },
    { icon: <Dribbble className="h-10 w-10" />, name: "Bounce" },
    { icon: <Droplet className="h-10 w-10" />, name: "Purity" },
    { icon: <Drum className="h-10 w-10" />, name: "Rhythm" },
    { icon: <Egg className="h-10 w-10" />, name: "Protein" },
    { icon: <Eye className="h-10 w-10" />, name: "Vision" },
    { icon: <Fan className="h-10 w-10" />, name: "Cool Down" },
    { icon: <Feather className="h-10 w-10" />, name: "Lightness" },
    { icon: <FerrisWheel className="h-10 w-10" />, name: "Fun" },
    { icon: <File className="h-10 w-10" />, name: "Plan" },
    { icon: <Film className="h-10 w-10" />, name: "Story" },
    { icon: <Flag className="h-10 w-10" />, name: "Milestone" },
    { icon: <Flower className="h-10 w-10" />, name: "Bloom" },
    { icon: <Folder className="h-10 w-10" />, name: "Organize" },
    { icon: <Gamepad2 className="h-10 w-10" />, name: "Playtime" },
    { icon: <Gauge className="h-10 w-10" />, name: "Measure" },
    { icon: <Gift className="h-10 w-10" />, name: "Reward" },
    { icon: <Globe className="h-10 w-10" />, name: "Worldwide" },
    { icon: <GraduationCap className="h-10 w-10" />, name: "Knowledge" },
    { icon: <Grid className="h-10 w-10" />, name: "Structure" },
    { icon: <Hand className="h-10 w-10" />, name: "Help" },
    { icon: <Headphones className="h-10 w-10" />, name: "Music" },
    { icon: <History className="h-10 w-10" />, name: "Progress" },
    { icon: <Home className="h-10 w-10" />, name: "Comfort" },
    { icon: <Hourglass className="h-10 w-10" />, name: "Patience" },
    { icon: <IceCream className="h-10 w-10" />, name: "Indulge" },
    { icon: <Image className="h-10 w-10" />, name: "Scenery" },
    { icon: <Inbox className="h-10 w-10" />, name: "Tasks" },
    { icon: <Infinity className="h-10 w-10" />, name: "Forever" },
    { icon: <Key className="h-10 w-10" />, name: "Success" },
    { icon: <Landmark className="h-10 w-10" />, name: "Strength" },
    { icon: <Languages className="h-10 w-10" />, name: "Translate" },
    { icon: <Laptop className="h-10 w-10" />, name: "Desk Job" },
    { icon: <Laugh className="h-10 w-10" />, name: "Joy" },
    { icon: <Library className="h-10 w-10" />, name: "Wisdom" },
    { icon: <Lightbulb className="h-10 w-10" />, name: "Idea" },
    { icon: <Link className="h-10 w-10" />, name: "Connect" },
    { icon: <List className="h-10 w-10" />, name: "Checklist" },
    { icon: <Lock className="h-10 w-10" />, name: "Secure" },
    { icon: <Luggage className="h-10 w-10" />, name: "Travel" },
    { icon: <Magnet className="h-10 w-10" />, name: "Attract" },
    { icon: <Mail className="h-10 w-10" />, name: "Message" },
    { icon: <Martini className="h-10 w-10" />, name: "Celebrate" },
    { icon: <Medal className="h-10 w-10" />, name: "Achievement" },
    { icon: <Megaphone className="h-10 w-10" />, name: "Announce" },
    { icon: <Menu className="h-10 w-10" />, name: "Options" },
    { icon: <MessageCircle className="h-10 w-10" />, name: "Talk" },
    { icon: <Mic className="h-10 w-10" />, name: "Voice" },
    { icon: <Monitor className="h-10 w-10" />, name: "Display" },
    { icon: <Moon className="h-10 w-10" />, name: "Night" },
    { icon: <Mouse className="h-10 w-10" />, name: "Click" },
    { icon: <Move className="h-10 w-10" />, name: "Move" },
    { icon: <Music className="h-10 w-10" />, name: "Melody" },
    { icon: <Newspaper className="h-10 w-10" />, name: "News" },
    { icon: <Nut className="h-10 w-10" />, name: "Healthy Fats" },
    { icon: <Package className="h-10 w-10" />, name: "Deliver" },
    { icon: <Palmtree className="h-10 w-10" />, name: "Vacation" },
    { icon: <Pause className="h-10 w-10" />, name: "Break" },
    { icon: <Pencil className="h-10 w-10" />, name: "Write" },
    { icon: <Phone className="h-10 w-10" />, name: "Call" },
    { icon: <PieChart className="h-10 w-10" />, name: "Data" },
    { icon: <Pin className="h-10 w-10" />, name: "Location" },
    { icon: <Plane className="h-10 w-10" />, name: "Flight" },
    { icon: <Plug className="h-10 w-10" />, name: "Connect" },
    { icon: <Plus className="h-10 w-10" />, name: "Add" },
    { icon: <Pocket className="h-10 w-10" />, name: "Carry" },
    { icon: <Podcast className="h-10 w-10" />, name: "Listen" },
    { icon: <Power className="h-10 w-10" />, name: "On" },
    { icon: <Printer className="h-10 w-10" />, name: "Print" },
    { icon: <Puzzle className="h-10 w-10" />, name: "Solve" },
    { icon: <Quote className="h-10 w-10" />, name: "Quote" },
    { icon: <RefreshCw className="h-10 w-10" />, name: "Restart" },
    { icon: <Reply className="h-10 w-10" />, name: "Back" },
    { icon: <Rewind className="h-10 w-10" />, name: "Rewind" },
    { icon: <RollerCoaster className="h-10 w-10" />, name: "Thrill" },
    { icon: <Rss className="h-10 w-10" />, name: "Feed" },
    { icon: <Ruler className="h-10 w-10" />, name: "Measure" },
    { icon: <Save className="h-10 w-10" />, name: "Save" },
    { icon: <Scissors className="h-10 w-10" />, name: "Cut" },
    { icon: <Search className="h-10 w-10" />, name: "Find" },
    { icon: <Send className="h-10 w-10" />, name: "Share" },
    { icon: <Server className="h-10 w-10" />, name: "Data" },
    { icon: <Settings className="h-10 w-10" />, name: "Adjust" },
    { icon: <Shield className="h-10 w-10" />, name: "Protect" },
    { icon: <ShoppingBag className="h-10 w-10" />, name: "Shop" },
    { icon: <ShoppingCart className="h-10 w-10" />, name: "Buy" },
    { icon: <Shrub className="h-10 w-10" />, name: "Garden" },
    { icon: <Shuffle className="h-10 w-10" />, name: "Mix" },
    { icon: <Signal className="h-10 w-10" />, name: "Connect" },
    { icon: <Smartphone className="h-10 w-10" />, name: "Mobile" },
    { icon: <Smile className="h-10 w-10" />, name: "Happy" },
    { icon: <Speaker className="h-10 w-10" />, name: "Sound" },
    { icon: <Square className="h-10 w-10" />, name: "Block" },
    { icon: <Sun className="h-10 w-10" />, name: "Day" },
    { icon: <Swords className="h-10 w-10" />, name: "Battle" },
    { icon: <Tablet className="h-10 w-10" />, name: "Device" },
    { icon: <Tag className="h-10 w-10" />, name: "Label" },
    { icon: <TargetIcon className="h-10 w-10" />, name: "Target" },
    { icon: <Tent className="h-10 w-10" />, name: "Camping" },
    { icon: <ThumbsDown className="h-10 w-10" />, name: "Dislike" },
    { icon: <ThumbsUp className="h-10 w-10" />, name: "Like" },
    { icon: <Timer className="h-10 w-10" />, name: "Time" },
    { icon: <ToggleLeft className="h-10 w-10" />, name: "Switch" },
    { icon: <Train className="h-10 w-10" />, name: "Journey" },
    { icon: <Trash className="h-10 w-10" />, name: "Delete" },
    { icon: <TreePine className="h-10 w-10" />, name: "Forest" },
    { icon: <TrendingUp className="h-10 w-10" />, name: "Grow" },
    { icon: <Triangle className="h-10 w-10" />, name: "Shape" },
    { icon: <Truck className="h-10 w-10" />, name: "Deliver" },
    { icon: <Umbrella className="h-10 w-10" />, name: "Protection" },
    { icon: <Upload className="h-10 w-10" />, name: "Upload" },
    { icon: <Video className="h-10 w-10" />, name: "Record" },
    { icon: <Wallet className="h-10 w-10" />, name: "Finance" },
    { icon: <Watch className="h-10 w-10" />, name: "Timepiece" },
    { icon: <Wifi className="h-10 w-10" />, name: "Signal" },
    { icon: <Wine className="h-10 w-10" />, name: "Relax" },
    { icon: <Wrench className="h-10 w-10" />, name: "Fix" },
    { icon: <ZoomIn className="h-10 w-10" />, name: "Closer" },
];

const motivationalMessages = [
    "Every step counts!", "You're off to a great start!", "Amazing progress, keep it up!", "Fantastic work! You're crushing it!", "Let's get moving!", "The journey of a thousand miles begins with a single step.", "Believe you can and you're halfway there.", "The only bad workout is the one that didn't happen.", "Success is the sum of small efforts, repeated day in and day out.", "Your body can stand almost anything. It's your mind that you have to convince.",
    "The secret of getting ahead is getting started.", "Don't watch the clock; do what it does. Keep going.", "A little progress each day adds up to big results.", "The pain you feel today will be the strength you feel tomorrow.", "It's not about being the best. It's about being better than you were yesterday.",
    "Do something today that your future self will thank you for.", "Push yourself, because no one else is going to do it for you.", "Your only limit is you.", "Strive for progress, not perfection.", "The harder the battle, the sweeter the victory.",
    "Motivation is what gets you started. Habit is what keeps you going.", "Success isn't always about greatness. It's about consistency.", "Wake up with determination. Go to bed with satisfaction.", "It does not matter how slowly you go as long as you do not stop.", "The body achieves what the mind believes.",
    "You are stronger than you think.", "Once you see results, it becomes an addiction.", "Fitness is not about being better than someone else. It's about being better than you used to be.", "Go the extra mile. It's never crowded.", "What seems impossible today will one day become your warm-up.",
    "The only way to finish is to start.", "Be stronger than your strongest excuse.", "I can and I will. Watch me.", "The groundwork for all happiness is good health.", "Take care of your body. It's the only place you have to live.",
    "Fall in love with taking care of yourself.", "Your health is an investment, not an expense.", "A healthy outside starts from the inside.", "To keep the body in good health is a duty.", "Energy and persistence conquer all things.",
    "An early-morning walk is a blessing for the whole day.", "Walking is the best possible exercise.", "The best way to predict the future is to create it.", "You miss 100% of the shots you don't take.", "The only person you are destined to become is the person you decide to be.",
    "Believe in yourself and all that you are.", "Small steps, big dreams.", "Keep your eyes on the stars, and your feet on the ground.", "It always seems impossible until it's done.", "Success is walking from failure to failure with no loss of enthusiasm.",
    "The future belongs to those who believe in the beauty of their dreams.", "Don't be afraid to give up the good to go for the great.", "If you can dream it, you can do it.", "The way to get started is to quit talking and begin doing.", "I find that the harder I work, the more luck I seem to have.",
    "Success usually comes to those who are too busy to be looking for it.", "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.", "The successful warrior is the average man, with laser-like focus.", "I am not a product of my circumstances. I am a product of my decisions.", "There is no substitute for hard work.",
    "You can't build a reputation on what you are going to do.", "The difference between ordinary and extraordinary is that little extra.", "The only place where success comes before work is in the dictionary.", "You don't have to be great to start, but you have to start to be great.", "Discipline is the bridge between goals and accomplishment.",
    "Well done is better than well said.", "Your limitation—it's only your imagination.", "Push yourself, no one else will do it for you.", "Great things never come from comfort zones.", "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.", "The harder you work for something, the greater you'll feel when you achieve it.", "Dream bigger. Do bigger.", "Don't stop when you're tired. Stop when you're done.", "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.", "It's going to be hard, but hard does not mean impossible.", "Don't wait for opportunity. Create it.", "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", "The key to success is to focus on goals, not obstacles.",
    "I'm not telling you it's going to be easy, I'm telling you it's going to be worth it.", "The secret of your future is hidden in your daily routine.", "The best time to plant a tree was 20 years ago. The second best time is now.", "If you want to lift yourself up, lift up someone else.", "It is never too late to be what you might have been.",
    "You must do the things you think you cannot do.", "If you're going through hell, keep going.", "I have not failed. I've just found 10,000 ways that won't work.", "What lies behind us and what lies before us are tiny matters compared to what lies within us.", "The best revenge is massive success.",
    "The mind is everything. What you think you become.", "An unexamined life is not worth living.", "Eighty percent of success is showing up.", "Your time is limited, so don't waste it living someone else's life.", "Winning isn't everything, but wanting to win is.",
    "I am the greatest, I said that even before I knew I was.", "You can't put a limit on anything. The more you dream, the farther you get.", "It's hard to beat a person who never gives up.", "There are no traffic jams along the extra mile.", "If you are not willing to risk the usual, you will have to settle for the ordinary.",
    "The successful man will profit from his mistakes and try again in a different way.", "A successful man is one who can lay a firm foundation with the bricks others have thrown at him.", "Success is how high you bounce when you hit bottom.", "If you want to achieve excellence, you can get there today. As of this second, quit doing less-than-excellent work.", "All progress takes place outside the comfort zone.",
    "You may only succeed if you desire succeeding; you may only fail if you do not mind failing.", "To be successful you must accept all challenges that come your way. You can't just accept the ones you like.", "Success is not final, failure is not fatal: it is the courage to continue that counts.", "The road to success and the road to failure are almost exactly the same.", "The secret to success is to know something nobody else knows.",
    "I attribute my success to this: I never gave or took any excuse.", "I never dreamed about success. I worked for it.", "If you really want to do something, you'll find a way. If you don't, you'll find an excuse.", "Don't let the fear of losing be greater than the excitement of winning.", "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.",
    "You are never too old to set another goal or to dream a new dream.", "That which does not kill us makes us stronger.", "The only thing that stands between you and your dream is the will to try and the belief that it is actually possible.", "With the new day comes new strength and new thoughts.", "A creative man is motivated by the desire to achieve, not by the desire to beat others.",
    "If you want to make your dreams come true, the first thing you have to do is wake up.", "Challenges are what make life interesting and overcoming them is what makes life meaningful.", "If you are not willing to learn, no one can help you. If you are determined to learn, no one can stop you.", "Don't be afraid to fail. Be afraid not to try.", "The man who has confidence in himself gains the confidence of others.",
    "What you get by achieving your goals is not as important as what you become by achieving your goals.", "The only limit to our realization of tomorrow will be our doubts of today.", "Creativity is intelligence having fun.", "What you do today can improve all your tomorrows.", "A goal is a dream with a deadline.",
    "Things work out best for those who make the best of how things work out.", "To live a creative life, we must lose our fear of being wrong.", "If you are not willing to risk the usual you will have to settle for the ordinary.", "Trust because you are willing to accept the risk, not because it's safe or certain.", "All our dreams can come true if we have the courage to pursue them.",
    "Good things come to people who wait, but better things come to those who go out and get them.", "If you do what you always did, you will get what you always got.", "Success is the sum of small efforts, repeated day-in and day-out.", "Just when the caterpillar thought the world was ending, he turned into a butterfly.", "Whenever you find yourself on the side of the majority, it is time to pause and reflect.",
    "The only true wisdom is in knowing you know nothing.", "The unexamined life is not worth living.", "Whereof one cannot speak, thereof one must be silent.", "The life of man is of no greater importance to the universe than that of an oyster.", "Even while they teach, men learn.",
    "There is only one good, knowledge, and one evil, ignorance.", "If you don't stand for something you will fall for anything.", "I can't go back to yesterday because I was a different person then.", "It is not that I'm so smart. But I stay with the questions much longer.", "We cannot solve our problems with the same thinking we used when we created them.",
    "A person who never made a mistake never tried anything new.", "Look deep into nature, and then you will understand everything better.", "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.", "Strive not to be a success, but rather to be of value.", "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
    "Insanity: doing the same thing over and over again and expecting different results.", "Try not to become a man of success, but rather try to become a man of value.", "He who is not courageous enough to take risks will accomplish nothing in life.", "It's not the years in your life that count. It's the life in your years.", "In the end, it's not the years in your life that count. It's the life in your years.",
    "Believe you can and you're halfway there.", "The only way to do great work is to love what you do.", "The future belongs to those who prepare for it today.", "Don't count the days, make the days count.", "Success is not in what you have, but who you are.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.", "In the middle of difficulty lies opportunity.", "I have no special talent. I am only passionately curious.", "The true sign of intelligence is not knowledge but imagination.", "Life is like riding a bicycle. To keep your balance, you must keep moving."
];

export default function MotivationalCard({ steps }: MotivationalCardProps) {
    const [iconIndex, setIconIndex] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const iconInterval = setInterval(() => {
            setIconIndex(Math.floor(Math.random() * icons.length));
        }, 3000); 

        const messageInterval = setInterval(() => {
            setMessageIndex(Math.floor(Math.random() * motivationalMessages.length));
        }, 5000); // Change message every 5 seconds

        return () => {
            clearInterval(iconInterval);
            clearInterval(messageInterval);
        };
    }, []);

    const currentIcon = useMemo(() => icons[iconIndex], [iconIndex]);
    const currentMessage = useMemo(() => {
         if (steps === null) return "Let's get moving!";
         if (steps === 0) return "Every step counts, let's start!";
         return motivationalMessages[messageIndex];
    }, [steps, messageIndex]);

    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-orange-400 text-primary-foreground">
             <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    .shimmer-bg {
                        animation: shimmer 10s linear infinite;
                        background-image: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%);
                        background-size: 200% 100%;
                    }
                `}
            </style>
            <div className="absolute inset-0 shimmer-bg" />
            <div className="relative flex flex-col md:flex-row items-center justify-between p-6">
                <div className="flex flex-col gap-1 z-10 mb-4 md:mb-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Footprints className="h-6 w-6" />
                        <span>Today's Steps</span>
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                       {currentMessage}
                    </CardDescription>
                    <div className="text-4xl font-bold mt-2">
                        {steps?.toLocaleString() ?? <span className="text-2xl">...</span>}
                    </div>
                </div>
                <div className="relative w-40 h-32 flex items-center justify-center overflow-hidden">
                    {icons.map((item, index) => (
                        <div
                            key={`${item.name}-${index}`}
                            className="absolute transition-all duration-1000 ease-in-out flex flex-col items-center gap-2"
                            style={{
                                transform: `rotate(${(index - iconIndex) * 20}deg) translate(60px) rotate(-${(index - iconIndex) * 20}deg)`,
                                opacity: index === iconIndex ? 1 : 0,
                            }}
                        >
                            {item.icon}
                            <span className="font-semibold text-xs">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
