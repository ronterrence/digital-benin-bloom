import { Artifact, mapArtifactImages } from "@/data/artifacts";

type Props = {
  artifact: Artifact;
};

export const ArtifactComparison = ({ artifact }: Props) => {
  const images = mapArtifactImages(artifact);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
		<p className="text-sm font-medium text-center text-muted-foreground">
			Original
		</p>
		<img
			src={images.original}
			alt={`${artifact.id} original`}
			className="w-full rounded-md bg-white"
		/>
	</div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Enhanced
        </p>
        <img
          src={images.enhanced}
          alt={`${artifact.id} enhanced`}
          className="w-full rounded-md bg-white"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Bronze
        </p>
        <img
          src={images.bronze}
          alt={`${artifact.id} bronze`}
          className="w-full rounded-md bg-white"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </div>
  );
};