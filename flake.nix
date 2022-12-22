{
  description = "Advent of Code in Typescript template";

  # Use the unstable nixpkgs to use the latest set of node packages
  inputs.nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = with pkgs; mkShell {
        buildInputs = [
          nodejs-18_x
          nodePackages.pnpm
          yarn
          aocd
          btop
          gh
          nodePackages.typescript
          nodePackages.typescript-language-server
        ];
      };
    });
}
