require("formatter").setup{
 filetype = {
     javascript = {
         require("formatter.filetype.javascript").eslint_d
     },
     javascriptreact = {
         require("formatter.filetype.javascriptreact").eslint_d
     },
     typescript = {
         require("formatter.filetype.typescript").eslint_d
     },
     typescriptreact = {
         require("formatter.filetype.javascriptreact").eslint_d
     }
 }
}
