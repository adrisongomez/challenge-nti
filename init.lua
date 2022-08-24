require("formatter").setup{
 filetype = {
     javascript = {
         require("formatter.filetype.javascript").eslint
     },
     javascriptreact = {
         require("formatter.filetype.javascriptreact").eslint
     },
     typescript = {
         require("formatter.filetype.typescript").eslint
     },
     typescriptreact = {
         require("formatter.filetype.javascriptreact").eslint
     }
 }
}
