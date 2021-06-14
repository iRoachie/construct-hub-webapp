import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";
import { getAssetsPath, getFullPackageName } from "./util";

type Assemblies = { [packageName: string]: spec.Assembly };

export async function createAssembly(
  name: string,
  version: string,
  scope?: string
): Promise<reflect.Assembly> {
  const assemblies = await fetchAssemblies(name, version, scope);
  const ts = new reflect.TypeSystem();
  Object.values(assemblies).forEach((a) => {
    ts.addAssembly(new reflect.Assembly(ts, a));
  });
  return ts.findAssembly(getFullPackageName(name, scope));
}

async function fetchAssemblies(
  name: string,
  version: string,
  scope?: string
): Promise<Assemblies> {
  const assemblies: Assemblies = {};

  async function recurse(_name: string, _version: string, _scope?: string) {
    const assembly = await fetchAssembly(_name, _version, _scope);
    const packageFqn = `${getFullPackageName(_name, _scope)}@${_version};`;
    if (assemblies[packageFqn]) {
      return;
    }
    assemblies[packageFqn] = assembly;
    for (const [d, v] of Object.entries(assembly.dependencies ?? {})) {
      const scopeAndName = d.split("/");
      if (scopeAndName.length > 1) {
        await recurse(scopeAndName[1], v, scopeAndName[0]);
      } else {
        await recurse(scopeAndName[0], v, "");
      }
    }
  }

  await recurse(name, version, scope);

  return assemblies;
}

async function fetchAssembly(
  name: string,
  version: string,
  scope?: string
): Promise<spec.Assembly> {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }

  const assemblyPath = `${getAssetsPath(name, version, scope)}/jsii.json`;
  const response = await fetch(assemblyPath);
  if (!response.ok) {
    throw new Error(
      `Failed fetching assembly for ${assemblyPath}: ${response.statusText}`
    );
  }
  return response.json();
}