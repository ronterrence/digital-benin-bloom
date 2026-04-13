import { useState } from "react";

export function HistoricalNarrativeSection() {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-2xl border border-border/40 bg-card/30 p-6 md:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-primary/80">
          Historical Context
        </p>
		<div className="border-t border-border/50 my-16" />
        <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
         Audio Narrative The Rise and Fall of the Kingdom of Benin.
        </h2>

        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Audio narrative based on <em>The Benin Massacre</em> (1897) by Captain Alan Boisragon commandant of the Niger Coast Protectorate force, a colonial military account interpreted critically, providing historical context for the objects in the exhibition.
        </p>

        <div className="mb-4">
          <audio controls className="w-full">
            <source src="/audio/benin-expedition-narrative.m4a" type="audio/mp4" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <button
          onClick={() => setShowTranscript((v) => !v)}
          className="mb-4 inline-flex rounded-full border border-primary/30 px-4 py-2 text-sm text-primary transition hover:bg-primary/10"
        >
          {showTranscript ? "Hide Transcript" : "Read Transcript"}
        </button>

        {showTranscript && (
          <div className="max-h-96 space-y-4 overflow-y-auto rounded-xl bg-background/40 p-4 text-sm leading-7 text-foreground/90">
            <p><strong>Speaker 1:</strong> Imagine being an English explorer, right? The year is 1553. You've just survived this harrowing months long ocean voyage to a completely unknown West African kingdom,</p>

			<p><strong>Speaker 2:</strong> And you're probably expecting what a really primitive barter system. Exactly.</p>

			<p><strong>Speaker 1:</strong> You figure you'll trade some glass beads, maybe some basic metal for local goods, but instead, you were brought before the king, and not only does he welcome you, he actually starts speaking to you in fluent Portuguese,</p>

			<p><strong>Speaker 2:</strong> Which just completely shatters every expectation they have.</p>

			<p><strong>Speaker 1:</strong> Right? And when he realizes you don't even have enough merchandise to buy his massive stockpile of pepper, he offers you a highly sophisticated forward contract on credit until the next trading season.</p>

			<p><strong>Speaker 2:</strong> It's incredible. We're looking at a civilization today that just completely upended European assumptions only to eventually meet a very dark or really complex end.</p>

			<p><strong>Speaker 1:</strong> Which brings us to our mission for you today. Welcome to this deep dive. Our main source material for this exploration is an 1897 firsthand account. It's titled The Benin Massacre,</p>

			<p><strong>Speaker 2:</strong> Written by Captain Alan Boyes Ragon,</p>

			<p><strong>Speaker 1:</strong> Who is the commandant of the Niger Coast Protectorate force. We are going to trace the fascinating history of the Kingdom of Benin, which is in modern day Nigeria. We'll follow its arc from that golden age of global trade through some truly bizarre cultural encounters right down to its violent clash with late 19th century British colonialism.</p>

			<p><strong>Speaker 2:</strong> But before we jump into the swim line, we do have to frame how we are reading this text.</p>

			<p><strong>Speaker 1:</strong> Definitely we need to be crystal clear with you up front. This source was written by British Colonial military officer in 1897.</p>

			<p><strong>Speaker 2:</strong> Yeah. So it is saturated with heavy colonial biases.</p>

			<p><strong>Speaker 1:</strong> Exactly. It has a very specific imperial worldview, and our goal here today is absolutely not to endorse the author's perspective or you know, take any political sides. We are simply going to impartially unpack the historical facts, the raw data, and those cultural encounters captured in the text.</p>

			<p><strong>Speaker 2:</strong> The value of a primary source like this isn't in accepting its judgments as absolute truth. It's in reverse engineering the events it describes</p>

			<p><strong>Speaker 1:</strong> We're looking past the bias to extract the underlying mechanics of what actually happened.</p>

			<p><strong>Speaker 2:</strong> Right? Because if you read between the lines, the text accidentally reveals a tremendous amount about the economic sophistication, the logistics, and the strategic maneuvering of the Benin Kingdom.</p>

			<p><strong>Speaker 1:</strong> So let's start exactly there with the economics of that 1553 expedition, because honestly, it reads less like a grand voyage of discovery and more like a disaster I corporate retreat.</p>

			<p><strong>Speaker 2:</strong> It really does. The expedition was led by two captains who fundamentally did not get along. You had an Englishman named Wyndham and a Portuguese navigator named Antonio Anis Pintiado.</p>

			<p><strong>Speaker 1:</strong> Okay. Let's unpack this because the king of Benin is operating like a visionary CEO. He learned Portuguese as a child from previous traders. He understands seasonal shipping logistics.</p>

			<p><strong>Speaker 2:</strong> Yeah. Offering a massive shipment of pepper on credit means he has secure warehouses, surplus inventory, and</p>

			<p><strong>Speaker 1:</strong> And an understanding of long-term trade relationships. He's trying to build a multi-year supply chain, but the English side of this deal completely falls apart due to, well, basically middle management toxicity.</p>

			<p><strong>Speaker 2:</strong> That is the perfect way to put it, because Pentito actually had the requisite experience. He was highly respected in Europe, so much so that he previously held a royal patent from the king of Portugal.</p>

			<p><strong>Speaker 1:</strong> Oh, the barley allowance thing.</p>

			<p><strong>Speaker 2:</strong> Yes. This patent granted him a daily barley allowance for his horse with a bizarrely specific caveat that he wasn't allowed to marry for six years, presumably, so he wouldn't have children to inherit the allowance that</p>

			<p><strong>Speaker 1:</strong> Is so specific</p>

			<p><strong>Speaker 2:</strong> Quirky. Sure. But it shows he was a highly valued asset.</p>

			<p><strong>Speaker 1:</strong> So Pentito is basically the freely paid consultant brought in because he actually knows the local regulations and the language.</p>

			<p><strong>Speaker 2:</strong> Mm.</p>

			<p><strong>Speaker 1:</strong> And Wyndham is the insecure middle manager who would rather tank a billion dollar international merger out of pure petty jealousy than let the consultant get any credit.</p>

			<p><strong>Speaker 2:</strong> Wyndham's self-destruction is just staggering. He actively threatens to cut off Pentito's ears and nail them to the mast.</p>

			<p><strong>Speaker 1:</strong> Yikes.</p>

			<p><strong>Speaker 2:</strong> Yeah. He publicly belittles him, calling him a quote, rascally Jew. But the fatal blow to the expedition is logistical while their crew is anchored in the river, literally dying of sickness. At a rate of four or five men a day, Wyndham completely snaps.</p>

			<p><strong>Speaker 1:</strong> He breaks into Pentito's cabin. Right,</p>

			<p><strong>Speaker 2:</strong> Exactly. He destroys all the medicines and cordials Pentito had brought specifically to keep the crew healthy in that climate.</p>

			<p><strong>Speaker 1:</strong> To keep the corporate metaphor going, Wyndham is basically deleting the entire company database and smashing the servers on his way out the door.</p>

			<p><strong>Speaker 2:</strong> He essentially bankrupts the whole venture outta spite the biological reality of destroying that medicine meant almost immediate doom. Wyndham dies of sickness himself shortly after.</p>

			<p><strong>Speaker 1:</strong> Wow.</p>

			<p><strong>Speaker 2:</strong> And Pentito, who bizarrely still mourned, the man who abused him dies just a week later. Out of the 140 able-bodied men who started the voyage scarcely 40 survived to limp back to England.</p>

			<p><strong>Speaker 1:</strong> That's a massive casualty rate.</p>

			<p><strong>Speaker 2:</strong> They even had to scuttle and sink one of their own ships because they simply didn't have the hands left to sail it.</p>

			<p><strong>Speaker 1:</strong> Wait, I'm trying to connect the dots here. If Wyndham poisoned the well so badly in 1553 and practically destroyed that initial trade route, how did Benin actually recover to become the magnificent, wealthy metropolis that Dutch explorers found in the years that followed?</p>

			<p><strong>Speaker 2:</strong> Well, the kingdom's foundational wealth wasn't reliant on a single disastrous English voyage. They had established overland routes and ongoing trade with the Portuguese.</p>

			<p><strong>Speaker 1:</strong> Oh, right.</p>

			<p><strong>Speaker 2:</strong> By the time Dutch explorers like a man named Dancic arrive and document the city Benin had leveraged its position into massive civic infrastructure.</p>

			<p><strong>Speaker 1:</strong> The picture these Dutch explorers paint for you as breathtaking, they describe a highly organized cosmopolitan African metropolis. We're talking about incredibly long, broad streets, so long and straight you couldn't even see to the end of them.</p>

			<p><strong>Speaker 2:</strong> This wasn't just organic sprawling growth either the city was protected by massive earthen bulwarks and deep dry ditches filled with high trees.</p>

			<p><strong>Speaker 1:</strong> That kind of earthwork is no joke.</p>

			<p><strong>Speaker 2:</strong> No. That level of civic engineering requires a highly centralized government capable of mobilizing massive amounts of labor. You only get that when a society is incredibly prosperous and secure,</p>

			<p><strong>Speaker 1:</strong> And the social structure was incredibly elaborate. The king had about 600 wives, which beyond just being a massive number, usually implies a vast network of political alliances with various regional families.</p>

			<p><strong>Speaker 2:</strong> Absolutely.</p>

			<p><strong>Speaker 1:</strong> The aristocratic gentlemen of the city had 80 to 90 wives each. But my absolute favorite detail from the text, and it is so specific, is how these VIP gentlemen traveled to court.</p>

			<p><strong>Speaker 2:</strong> What's fascinating here is the stark contrast between this vivid reality and the simplistic, often dismissive views of African history prevalent in nineteenth-century Europe.</p>

			<p><strong>Speaker 1:</strong> Right. So picture this, the gentleman is riding on horseback, but he's so weighed down by his own status, or perhaps just the sheer impracticality of his ceremonial dress that he needs two men walking on either side just to physically prop him up on the horse</p>

			<p><strong>Speaker 2:</strong> Just to keep him from falling over.</p>

			<p><strong>Speaker 1:</strong> Exactly. He is surrounded by an entourage of slaves holding giant shields just to keep the sun off his head and immediately behind him trailing his horse is a raucous band playing drums, horns, and striking hollow irons with flint.</p>

			<p><strong>Speaker 2:</strong> You have to imagine the sensory overload of that.</p>

			<p><strong>Speaker 1:</strong> No wonder they couldn't balance on the horses. You've got a heavy metal percussion section blasting right behind your horse's ears. I need two guys holding me up. Right, too.</p>

			<p><strong>Speaker 2:</strong> Jokes aside. That level of public pageantry requires a massive surplus of wealth. It's a highly stratified social hierarchy where labor is so abundant that four people can be dedicated entirely to a single man's daily commute.</p>

			<p><strong>Speaker 1:</strong> I'm struggling with the timeline here though. How does a magnificent broad-street trading empire bursting with this kind of wealth turned into the scattered isolated half-ruined mud houses that British Captain Galway found when he arrived in 1892?</p>

			<p><strong>Speaker 2:</strong> The shift is fundamentally economic, which triggers a massive cultural and political shift. Two major things happen. First, the global economy changes. The eventual abolition of the slave trade cuts off a massive source of the kingdom's external wealth. Second, as that external trade falters and revenues drop, the king begins to rely more and more heavily on internal control mechanisms to maintain his grip on power.</p>

			<p><strong>Speaker 1:</strong> The text keeps throwing around this word juju. Is that just a catch-all British term for local religion, or was it a specific political tool? The king was wielding.</p>

			<p><strong>Speaker 2:</strong> It was a deeply ingrained spiritual force, but practically speaking, it functioned as the ultimate legal and political framework. The king was the representative of the spiritual power.</p>

			<p><strong>Speaker 1:</strong> I see. So</p>

			<p><strong>Speaker 2:</strong> When he issued a decree, it wasn't just a law, it was a divine mandate backed by the threat of supernatural consequence.</p>

			<p><strong>Speaker 1:</strong> Here's where it gets really interesting, because the king uses juju to implement an absolute ban on his people crossing water. No Benin man was allowed to get into a canoe or cross a river,</p>

			<p><strong>Speaker 2:</strong> Which is a huge deal for a trading empire.</p>

			<p><strong>Speaker 1:</strong> Right. But wait, if you're a king, your power comes from your wealth and your wealth comes from trade, why would you willingly hand your entire supply chain over to a third party by banning your own people from the rivers? Was he just blinded by religious zeal or is there a cynical political calculation there?</p>

			<p><strong>Speaker 2:</strong> It's likely a mix of both functioning as extreme isolationism by cutting off direct contact with the coast. The king might have been trying to insulate his core population from the destabilizing influence of European merchants and the shifting coastal economies.</p>

			<p><strong>Speaker 1:</strong> Okay, that makes sense.</p>

			<p><strong>Speaker 2:</strong> But mechanically, this water ban forced the kingdom of Benin to rely entirely on two neighboring tribes, the Jackras and ejos, because the Benin people couldn't cross the water. These coastal tribes became the mandatory unavoidable middlemen between the white merchants on the coast and the inland oil producers.</p>

			<p><strong>Speaker 1:</strong> And those middlemen played both sides brilliantly. They essentially weaponized the flow of information. They deliberately spread terrifying rumors to both sides to ensure the European merchants and the inland producers were too scared to ever meet face-to-face. They</p>

			<p><strong>Speaker 2:</strong> Would tell the Europeans that the inland rulers were bloodthirsty giants, and they tell the inlanders that the Europeans were sea monsters.</p>

			<p><strong>Speaker 1:</strong> That is wild.</p>

			<p><strong>Speaker 2:</strong> By controlling what each side believed about the other, the jackras and e jaws protected their own commissions. It's a brilliantly executed classic supply chain bottleneck.</p>

			<p><strong>Speaker 1:</strong> But while this middleman economy was slowly strangling Benin's trade, that deep cultural isolation led to some truly absurd historical encounters. When outsiders did manage to slip through, the text is full of these surreal moments.</p>

			<p><strong>Speaker 2:</strong> Oh, the Burton visit?</p>

			<p><strong>Speaker 1:</strong> Yes. Listen to this Sir Richard Burton, the famous explorer, actually manages to visit the king of Benin to entertain the king. Burton decides to perform an Arabian dance</p>

			<p><strong>Speaker 2:</strong> As one does</p>

			<p><strong>Speaker 1:</strong> Right and Burton's fires up a harmonium and starts playing a hymn, and the specific song the Missionary chooses to play for the King, we shall meet to Part No More, which Burton Riley noted in his own journals should probably have been, we Shall Part to Meet No More.</p>

			<p><strong>Speaker 2:</strong> The level of cultural dissonance in that room is staggering. You have an English explorer doing an Arabian dance to Christian hymns for an isolated West African king</p>

			<p><strong>Speaker 1:</strong> Like a fever dream.</p>

			<p><strong>Speaker 2:</strong> But it highlights how incredibly detached these rulers had become from the reality of the encroaching colonial powers.</p>

			<p><strong>Speaker 1:</strong> The author of our source material Captain Boyagon includes another tangent about a different ruler. The Ashanti King Prempeh Prempeh apparently put on a dance with a toy bow and a toy gun.</p>

			<p><strong>Speaker 2:</strong> Hmm.</p>

			<p><strong>Speaker 1:</strong> To prove to the British that he was the strongest, most invincible man in the world. Ray,</p>

			<p><strong>Speaker 2:</strong> He's putting on this huge show</p>

			<p><strong>Speaker 1:</strong> And he's dancing around acting completely untouchable until a British official named Mr. Vroon simply holds up two fingers and a king completely collapses in fear.</p>

			<p><strong>Speaker 2:</strong> Those two fingers were a psychological trigger. They symbolized the year 1875, which was a direct reference to a previous war where British military might had absolutely crushed them. Captain Boisragon uses these specific anecdotes to argue that these kingdoms, in his words, relapsed into savagedom because they got too big for their boots. He views their behavior entirely through the lens of primitive arrogance.</p>

			<p><strong>Speaker 1:</strong> I really wanna push back on that interpretation. Was it really just blind arrogance when you read the mechanics of what's happening? Doesn't this look like a desperate attempt by these rulers to use isolationism, juju, and mysticism to protect their borders? That's</p>

			<p><strong>Speaker 2:</strong> A really good point.</p>

			<p><strong>Speaker 1:</strong> Think about it. If you know you absolutely cannot beat explosive artillery on an open battlefield, maybe your only logical defense mechanism is to project an aura of unapproachable mystical terror. You hide behind the rivers, you enforce spiritual bands and you try to scare them off.</p>

			<p><strong>Speaker 2:</strong> That is a highly astute reading of the situation when you were outgunned technologically. Psychological warfare and geographic isolation are often the only strategic levers you have left, and the technological disparity by the 1890s wasn't just a gap. It was an absolute chasm.</p>

			<p><strong>Speaker 1:</strong> Which brings us to the terrifying reality on the ground during the late 19th century, the era of the colonial machine, the geopolitical setup in this region was incredibly complex. It wasn't just the British government sending in a traditional army. You had massive corporate armies operating in the same space.</p>

			<p><strong>Speaker 2:</strong> Yeah. You had the Royal Niger Company, which functioned very much like the Old East India company. They were a corporate entity, but they employed their own fierce house of fighters from the north.</p>

			<p><strong>Speaker 1:</strong> Right.</p>

			<p><strong>Speaker 2:</strong> And operating right next to them. You had the Niger Coast Protectorate, which was busy policing a massive humid network of rivers and creeks using Yoruba troops.</p>

			<p><strong>Speaker 1:</strong> The weapons these forces brought into this dense forest environment were fundamentally terrifying to the local populations. The source material details, exactly how the locals tried to make sense of this technology. They called the British seven Pounder field guns, them gun that shoot twice.</p>

			<p><strong>Speaker 2:</strong> That nickname comes from the mechanics of the ammunition. The locals were used to traditional musket fire or solid cannonballs. Just</p>

			<p><strong>Speaker 1:</strong> A single impact.</p>

			<p><strong>Speaker 2:</strong> Exactly. But the seven pounder fired an explosive shell, so they would hear the initial boom of the gun firing, and then miles away the shell itself would explode.</p>

			<p><strong>Speaker 1:</strong> They considered a deeply unfair and supernatural that a weapon could hunt you down and kill you when you thought you were safely outta range.</p>

			<p><strong>Speaker 2:</strong> They also faced the Maxim machine guns. There is a deeply unsettling anecdote in the text where a supposedly friendly local chief is shown how a Maxim gun works.</p>

			<p><strong>Speaker 1:</strong> Oh, this port is crazy.</p>

			<p><strong>Speaker 2:</strong> He's so delighted by the mechanical novelty of it that he happily wastes 500 rounds of ammunition just holding the button down, firing into the trees,</p>

			<p><strong>Speaker 1:</strong> And then there were the war rockets, which the locals viewed as an invention of the devil. Because of their erratic flight paths, the rockets would violently ricochet off trees and literally hunt people through the dense forest.</p>

			<p><strong>Speaker 2:</strong> It's terrifying.</p>

			<p><strong>Speaker 1:</strong> It's a brutal collision of worlds. But to be completely impartial to the text, we also have to look at the reality of the internal juju customs that the British were reacting to. The raw data provided in the text reveals practices that were genuinely dark.</p>

			<p><strong>Speaker 2:</strong> The text extensively details human sacrifices that were required for royal and aristocratic funerals. Mechanically, this stemmed from a genuine belief system. The chiefs believed that just as they needed an entourage of hundreds of people in life, they needed a human entourage to serve them in the afterlife.</p>

			<p><strong>Speaker 1:</strong> There are also widespread accounts, cannibalism. The text shares a grimly, absurd, almost surreal story of a chief's son. This was a young man who had actually spent years in England being formally educated at a missionary college.</p>

			<p><strong>Speaker 2:</strong> Right. He had a formal western education, yet</p>

			<p><strong>Speaker 1:</strong> He's described walking casually through his hometown with the severed leg of a cannibal. He over his shoulder, and he actually stops to offer a bite to a passing French Catholic priest.</p>

			<p><strong>Speaker 2:</strong> It's jarring, and perhaps the most tragic, custom detailed is the practice of twin killing. If a woman gave birth to twins, the local juju dictated that the babies must be killed or thrown into the gush to die.</p>

			<p><strong>Speaker 1:</strong> That's just awful.</p>

			<p><strong>Speaker 2:</strong> The mother was banished from the community to starve, and the father was required to sacrifice sheep just to purify the village of the perceived spiritual taint.</p>

			<p><strong>Speaker 1:</strong> If we connect this to the bigger picture</p>

			<p><strong>Speaker 2:</strong> It, you begin to see the ultimate jarring paradox of this specific era of British colonialism.</p>

			<p><strong>Speaker 1:</strong> Exactly. On one hand, you have the sprawling colonial military machine using horrifying weapons of war explosive shells, erratic war rockets, Maxim guns, all to supposedly civilize a region through overwhelming destructive force</p>

			<p><strong>Speaker 2:</strong> While simultaneously operating in the exact same region. You have individuals like the Scottish missionary, miss Slessor, who the text explicitly mentions she wasn't using Maxim guns.</p>

			<p><strong>Speaker 1:</strong> No, she wasn't.</p>

			<p><strong>Speaker 2:</strong> She was out there doing the slow, grueling, entirely peaceful work of actually saving lives. She was personally building sanctuary villages where these banished mothers of twins could live, find community, and raise their babies in safety.</p>

			<p><strong>Speaker 1:</strong> It perfectly encapsulates the profound moral contradiction of the era, the heavy-handed, utterly destructive force of an imperial military machine operating right alongside localized deeply compassionate human intervention. It's a complex web of causes, effects and moral dissonance that defies simple categorization.</p>

			<p><strong>Speaker 2:</strong> It really does.</p>

			<p><strong>Speaker 1:</strong> So let's bring it all together for you. We've traced the incredible volatil arc of the Kingdom of Benin. It started as this thriving globally connected, highly sophisticated sixteenth-century powerhouse, a civilization capable of issuing international forward contracts and building massive civic infrastructure.</p>

			<p><strong>Speaker 2:</strong> But it fell victim to a changing global economy when the slave trade ended.</p>

			<p><strong>Speaker 1:</strong> Right. It crippled its own trade through internal isolationism, relying on juju water bans and those unavoidable middleman economies. And ultimately, it was violently crushed by the overwhelming technological superiority of the late-nineteenth-century British colonial machine.</p>

			<p><strong>Speaker 2:</strong> The transition from a society that stunned European explorers with its endless broad streets and cosmopolitan wealth to a society relying on fear, spiritual bands, and physical isolation to hold back the tide of a global empire is a profound historical lesson in adaptability. When the external world changes systems that rely on rigid isolation, inevitably fracture.</p>

			<p><strong>Speaker 1:</strong> So what does this all mean? How does a sixteenth-century water ban apply to us today? Think about that middleman economy we discussed.</p>

			<p><strong>Speaker 2:</strong> Yeah.</p>

			<p><strong>Speaker 1:</strong> The Jackras and Ejaws tribes held all the economic power and shaped the geopolitical reality of an entire region simply by controlling the flow of information.</p>

			<p><strong>Speaker 2:</strong> Yeah. They spread the rumors. They kept the producers and the buyers apart so they could take their cut.</p>

			<p><strong>Speaker 1:</strong> The underlying mechanics of power haven't changed at all. Only the technology has today. Whoever controls the algorithms, the social media platforms or the massive data pipelines, acts as the modern middleman.</p>

			<p><strong>Speaker 2:</strong> That's a great point. If you can keep two groups of people apart or completely control what they believe about each other, you hold the actual power in a society regardless of who ostensibly sits on the political throne,</p>

			<p><strong>Speaker 1:</strong> Which leaves us with a final thought for you to mull over. We easily look back at the King of Benin banning his people from crossing water due to juju or in-century aristocrats, needing two guys to hold them upright on a horse as bizarre, inexplicable, historical oddities. But if a completely impartial historian from 400 years in the future were to write a detached alien account of our society today.</p>

			<p><strong>Speaker 2:</strong> Oh, that's an interesting thought experiment.</p>

			<p><strong>Speaker 1:</strong> What everyday practices or unwritten economic rules of ours would they document as absolutely primitive, inexplicable, or savage? If we</p>

			<p><strong>Speaker 2:</strong> Aren't careful, we might just be the fractured shadow waiting to be discovered next.</p>
          </div>
        )}
      </div>
	  
    </section>
    
  );
}