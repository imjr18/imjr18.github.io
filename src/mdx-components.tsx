import type { MDXComponents } from "mdx/types";
import { Figure } from "@/components/ui/Figure";

const components: MDXComponents = {
  Figure,
  table: (props) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
