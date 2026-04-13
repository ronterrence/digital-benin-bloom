import { Artifact, mapArtifactImages } from "@/data/artifacts";
import { ImageZoom } from "@/components/ImageZoom";

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
        <ImageZoom
          src={images.original}
          alt={`${artifact.id} original`}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Enhanced
        </p>
        <ImageZoom
          src={images.enhanced}
          alt={`${artifact.id} enhanced`}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Bronze
        </p>
        <ImageZoom
          src={images.bronze}
          alt={`${artifact.id} bronze`}
        />
      </div>
    </div>
  );
};