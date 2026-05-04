import { asset } from "@/lib/asset";

export default function SurvivalPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Survival
        </p>

        <h1 className="mb-6 text-4xl font-semibold text-gold md:text-5xl">
          What Remains
        </h1>

        <p className="mb-16 max-w-3xl text-lg leading-8 text-muted-foreground">
          While much of Benin was destroyed or displaced, traces of the original city and its
          structures remain. These fragments - architectural, archaeological, and digital - offer
          insight into what endured beyond the events of 1897.
        </p>

        {/* Resource Links */}
        <div className="mb-20 grid gap-6 md:grid-cols-2">
          <div className="h-full rounded-lg border border-border/50 p-6">
            <h3 className="mb-2 text-lg font-semibold text-gold">
              Archaeological Resource
            </h3>

            <p className="mb-4 text-sm text-muted-foreground">
              This article provides archaeological and historical context for the deeper roots of
              the Kingdom of Benin, helping situate the surviving traces of the city within a longer
              cultural and political history.
            </p>

            <a
              href="https://archaeology.org/issues/july-august-2024/letters-from/a-west-african-kingdoms-roots/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gold hover:underline"
            >
              Visit article
            </a>
          </div>

          <div className="h-full rounded-lg border border-border/50 p-6">
            <h3 className="mb-2 text-lg font-semibold text-gold">
              Ogiamien's House
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              The only surviving structure associated with the 1897 expedition, preserved as
              part of the historical record.
            </p>
            <a
              href="https://www.wmf.org/monuments/chief-ogiamiens-house"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gold hover:underline"
            >
              View heritage page
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-16 border-t border-border/50" />

        {/* Video Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gold md:text-3xl">
            Digital Reconstruction
          </h2>

          <video controls className="w-full rounded-lg border border-border/50">
			<source src={asset("videos/ogiamien.mp4")} type="video/mp4" />

          </video>

          <div className="mt-6 max-w-4xl space-y-6">
		  <p className="text-sm leading-6 text-muted-foreground">
			The video presents a 3D reconstruction of Ogiamien's House, one of the oldest surviving
			buildings in Benin City and a significant example of the architectural traditions of the
			Kingdom of Benin. Chief Ogiamien's Palace is said to have originally been built around 1160
			by the dynasty of rulers who preceded Oba Eweka . It miraculously survived the 1897 British destruction of Benin City and continued to be inhabited until 1975
		  </p>

		  <p className="text-sm leading-6 text-muted-foreground">
			In 2022, the Edo|cation team, together with MOWAA, documented the building using
			Structure from Motion photogrammetry and produced a digital 3D model. Edo|cation is
			funded by the Federal Foreign Office.
		  </p>

		  <div className="rounded-lg border border-border/50 p-5">
			<h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
			  Credits
			</h3>

			<div className="space-y-2 text-sm leading-6 text-muted-foreground">
			  <p><span className="text-foreground">Post-processing & 3D model:</span> Christian Hartl-Reiter</p>
			  <p><span className="text-foreground">Documentation:</span> Christian Hartl-Reiter, Diya Ayobami Samuel, Adeara Emmanuel Oluwatimilehin</p>
			  <p><span className="text-foreground">Music:</span> Osaheni Akpata</p>
			  <p><span className="text-foreground">Location coordinator:</span> Iwinosa Oyakhire</p>
			</div>
		  </div>

		  <div className="rounded-lg border border-border/50 p-5">
			<h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
			  Special Thanks
			</h3>
			<h3 className="mb-3 text-sm font-semibold semibold text-muted-foreground">Deutsches Archaologisches Institut
			</h3>
			<div className="space-y-1 text-sm leading-6 text-muted-foreground">
			  <p>Rich Arisco Osemwengie</p>
			  <p>Roland Ogiamien</p>
			  <p>Michelin Ogiamien</p>
			</div>
		  </div>

		  <div className="rounded-lg border border-border/50 p-5">
			<h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
			  Further Information
			</h3>

			<p className="text-sm leading-6 text-muted-foreground">
			  Nevadomsky, J., Lawson, N. & Hazlett, K. <em>An Ethnographic and Space Syntax Analysis
			  of Benin Kingdom Nobility Architecture.</em> <em>African Archaeological Review</em> 31, 59-85 (2014).
			</p>

			<a
			  href="https://link.springer.com/article/10.1007/s10437-014-9151-x"
			  target="_blank"
			  rel="noreferrer"
			  className="mt-3 inline-block text-sm text-gold hover:underline"
			>
			  View reference
			</a>
		  </div>
		</div>
        </div>
		

        {/* Closing line */}
        <div className="pt-4">
          <p className="max-w-2xl text-sm italic text-muted-foreground">
            What survives is not only what remains - but what is remembered and reconstructed.
          </p>
        </div>
      </div>
    </div>
  );
}
