declare module "react-simple-maps" {
  import type { ReactNode, SVGProps, MouseEventHandler } from "react";

  interface ProjectionConfig {
    center?: [number, number];
    scale?: number;
    rotate?: [number, number, number];
  }

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (params: { geographies: GeoFeature[] }) => ReactNode;
  }

  interface GeoFeature {
    rsmKey: string;
    id: string | number;
    properties: Record<string, unknown>;
    geometry: unknown;
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoFeature;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onMouseEnter?: MouseEventHandler<SVGGElement>;
    onMouseLeave?: MouseEventHandler<SVGGElement>;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
}
