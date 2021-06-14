import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAssembly } from "../../api/package/assemblies";
import { fetchMetadata } from "../../api/package/metadata";
import { PackageDetails } from "../../components/PackageDetails";
import { PackageDocs } from "../../components/PackageDocs";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest } from "../../hooks/useRequest";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

export function Package() {
  const { name, scope, version }: PathParams = useParams();
  const [requestAssembly, assemblyResponse] = useRequest(createAssembly);
  const [requestMetadata, metadataResponse] = useRequest(fetchMetadata);
  const q = useQueryParams();

  useEffect(() => {
    void requestAssembly(name, version, scope);
    void requestMetadata(name, version, scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, scope, version]);

  return (
    <Box w="100%">
      {/* Operator Area */}
      <PackageDetails
        assembly={assemblyResponse}
        metadata={metadataResponse}
        version={version}
      />
      {/* Readme and Api Reference Area */}
      {assemblyResponse.data && !assemblyResponse.loading && (
        <PackageDocs
          assembly={assemblyResponse.data}
          language={q.get("language") ?? "python"}
          submodule={q.get("submodule") ?? ""}
        />
      )}
    </Box>
  );
}