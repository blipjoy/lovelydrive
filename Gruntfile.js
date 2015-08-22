module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    path: {
      main: "build/app.js",
      min: "build/app.min.js",
      pack: "build/app.pack.js",
    },

/*
    concat: {
      dist: {
        src: [
          "lib/melonJS-<%= pkgl.version %>.js",
          "lib/plugins/*.js",
          "js/game.js",
          "build/js/resources.js",
          "js/** /*.js",
        ],
        dest: "build/js/app.js"
      }
    },
*/

    replace: {
      glsl: {
        options: {
          preserveOrder: true,
          patterns: [
            {
              // Remove comments
              match: /(\/\/.*?\n)|(\/\*(.|\n)*?\*\/)/g,
              replacement: ""
            },
            {
              // Remove leading and trailing whitespace from lines
              match: /(^\s+)|(\s+$)/g,
              replacement: ""
            },
            {
              // Remove line breaks
              match: /(\r|\n)+/g,
              replacement: ""
            },
            {
              // Remove unnecessary whitespace
              match: /\s*([;,[\](){}\\\/\-+*|^&!=<>?~%])\s*/g,
              replacement: "$1"
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: [ "src/glsl/*.glsl" ],
            dest: "build/glsl/"
          }
        ]
      },

      dist: {
        options: {
          variables: {
            "document.body.children[1].innerText": "\"<%= grunt.file.read('build/glsl/vertex.glsl') %>\"",
            "document.body.children[2].innerText": "\"<%= grunt.file.read('build/glsl/fragment.glsl') %>\"",
            "gl.TRIANGLES": 4,
            "gl.FLOAT": 5126,
            "gl.COLOR_BUFFER_BIT": 16384,
            "gl.ARRAY_BUFFER": 34962,
            "gl.DYNAMIC_DRAW": 35048,
            "gl.FRAGMENT_SHADER": 35632,
            "gl.VERTEX_SHADER": 35633,
            "gl.activeTexture": "gl[0]",
            "gl.attachShader": "gl[1]",
            "gl.bindAttribLocation": "gl[2]",
            "gl.bindBuffer": "gl[3]",
            "gl.bindFramebuffer": "gl[4]",
            "gl.bindRenderbuffer": "gl[5]",
            "gl.bindTexture": "gl[6]",
            "gl.blendColor": "gl[7]",
            "gl.blendEquation": "gl[8]",
            "gl.blendEquationSeparate": "gl[9]",
            "gl.blendFunc": "gl[10]",
            "gl.blendFuncSeparate": "gl[11]",
            "gl.bufferData": "gl[12]",
            "gl.bufferSubData": "gl[13]",
            "gl.checkFramebufferStatus": "gl[14]",
            "gl.clear": "gl[15]",
            "gl.clearColor": "gl[16]",
            "gl.clearDepth": "gl[17]",
            "gl.clearStencil": "gl[18]",
            "gl.colorMask": "gl[19]",
            "gl.compileShader": "gl[20]",
            "gl.compressedTexImage2D": "gl[21]",
            "gl.compressedTexSubImage2D": "gl[22]",
            "gl.copyTexImage2D": "gl[23]",
            "gl.copyTexSubImage2D": "gl[24]",
            "gl.createBuffer": "gl[25]",
            "gl.createFramebuffer": "gl[26]",
            "gl.createProgram": "gl[27]",
            "gl.createRenderbuffer": "gl[28]",
            "gl.createShader": "gl[29]",
            "gl.createTexture": "gl[30]",
            "gl.cullFace": "gl[31]",
            "gl.deleteBuffer": "gl[32]",
            "gl.deleteFramebuffer": "gl[33]",
            "gl.deleteProgram": "gl[34]",
            "gl.deleteRenderbuffer": "gl[35]",
            "gl.deleteShader": "gl[36]",
            "gl.deleteTexture": "gl[37]",
            "gl.depthFunc": "gl[38]",
            "gl.depthMask": "gl[39]",
            "gl.depthRange": "gl[40]",
            "gl.detachShader": "gl[41]",
            "gl.disable": "gl[42]",
            "gl.disableVertexAttribArray": "gl[43]",
            "gl.drawArrays": "gl[44]",
            "gl.drawElements": "gl[45]",
            "gl.enable": "gl[46]",
            "gl.enableVertexAttribArray": "gl[47]",
            "gl.finish": "gl[48]",
            "gl.flush": "gl[49]",
            "gl.framebufferRenderbuffer": "gl[50]",
            "gl.framebufferTexture2D": "gl[51]",
            "gl.frontFace": "gl[52]",
            "gl.generateMipmap": "gl[53]",
            "gl.getActiveAttrib": "gl[54]",
            "gl.getActiveUniform": "gl[55]",
            "gl.getAttachedShaders": "gl[56]",
            "gl.getAttribLocation": "gl[57]",
            "gl.getBufferParameter": "gl[58]",
            "gl.getContextAttributes": "gl[59]",
            "gl.getError": "gl[60]",
            "gl.getExtension": "gl[61]",
            "gl.getFramebufferAttachmentParameter": "gl[62]",
            "gl.getParameter": "gl[63]",
            "gl.getProgramInfoLog": "gl[64]",
            "gl.getProgramParameter": "gl[65]",
            "gl.getRenderbufferParameter": "gl[66]",
            "gl.getShaderInfoLog": "gl[67]",
            "gl.getShaderParameter": "gl[68]",
            "gl.getShaderPrecisionFormat": "gl[69]",
            "gl.getShaderSource": "gl[70]",
            "gl.getSupportedExtensions": "gl[71]",
            "gl.getTexParameter": "gl[72]",
            "gl.getUniform": "gl[73]",
            "gl.getUniformLocation": "gl[74]",
            "gl.getVertexAttrib": "gl[75]",
            "gl.getVertexAttribOffset": "gl[76]",
            "gl.hint": "gl[77]",
            "gl.isBuffer": "gl[78]",
            "gl.isContextLost": "gl[79]",
            "gl.isEnabled": "gl[80]",
            "gl.isFramebuffer": "gl[81]",
            "gl.isProgram": "gl[82]",
            "gl.isRenderbuffer": "gl[83]",
            "gl.isShader": "gl[84]",
            "gl.isTexture": "gl[85]",
            "gl.lineWidth": "gl[86]",
            "gl.linkProgram": "gl[87]",
            "gl.pixelStorei": "gl[88]",
            "gl.polygonOffset": "gl[89]",
            "gl.readPixels": "gl[90]",
            "gl.renderbufferStorage": "gl[91]",
            "gl.sampleCoverage": "gl[92]",
            "gl.scissor": "gl[93]",
            "gl.shaderSource": "gl[94]",
            "gl.stencilFunc": "gl[95]",
            "gl.stencilFuncSeparate": "gl[96]",
            "gl.stencilMask": "gl[97]",
            "gl.stencilMaskSeparate": "gl[98]",
            "gl.stencilOp": "gl[99]",
            "gl.stencilOpSeparate": "gl[100]",
            "gl.texImage2D": "gl[101]",
            "gl.texParameterf": "gl[102]",
            "gl.texParameteri": "gl[103]",
            "gl.texSubImage2D": "gl[104]",
            "gl.uniform1f": "gl[105]",
            "gl.uniform1fv": "gl[106]",
            "gl.uniform1i": "gl[107]",
            "gl.uniform1iv": "gl[108]",
            "gl.uniform2f": "gl[109]",
            "gl.uniform2fv": "gl[110]",
            "gl.uniform2i": "gl[111]",
            "gl.uniform2iv": "gl[112]",
            "gl.uniform3f": "gl[113]",
            "gl.uniform3fv": "gl[114]",
            "gl.uniform3i": "gl[115]",
            "gl.uniform3iv": "gl[116]",
            "gl.uniform4f": "gl[117]",
            "gl.uniform4fv": "gl[118]",
            "gl.uniform4i": "gl[119]",
            "gl.uniform4iv": "gl[120]",
            "gl.uniformMatrix2fv": "gl[121]",
            "gl.uniformMatrix3fv": "gl[122]",
            "gl.uniformMatrix4fv": "gl[123]",
            "gl.useProgram": "gl[124]",
            "gl.validateProgram": "gl[125]",
            "gl.vertexAttrib1f": "gl[126]",
            "gl.vertexAttrib1fv": "gl[127]",
            "gl.vertexAttrib2f": "gl[128]",
            "gl.vertexAttrib2fv": "gl[129]",
            "gl.vertexAttrib3f": "gl[130]",
            "gl.vertexAttrib3fv": "gl[131]",
            "gl.vertexAttrib4f": "gl[132]",
            "gl.vertexAttrib4fv": "gl[133]",
            "gl.vertexAttribPointer": "gl[134]",
            "gl.viewport": "gl[135]",
          },
          usePrefix: false,
          force: true,
          patterns: [
            {
              match: /\n\/\/ XXX: <[\s\S]*?\/\/ XXX: <\/.*\n/g,
              replacement: ""
            }
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: [ "src/app.js" ],
            dest: "build/"
          }
        ]
      },

      var: {
        options: {
          usePrefix: false,
          force: true,
          patterns: [
            {
              match: /var /g,
              replacement: ""
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: [ "<%= path.min %>" ],
            dest: "build/"
          }
        ]
      },
    },

    uglify: {
      options: {
        report: "min",
        preserveComments: false,
        mangle: {
          toplevel: true,
        }
      },
      dist: {
        files: {
          "<%= path.min %>": [ "<%= path.main %>" ],
        }
      }
    },

    regpack: {
      dist: {
        files: {
          "<%= path.pack %>": [ "<%= path.min %>" ],
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          "build/index.min.css": "style/index.css",
        }
      }
    },

    processhtml: {
      dist: {
        options: {
          process: true,
        },
        files: {
          "build/index.html": [ "index.html" ],
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          "build/index.html": "build/index.html"
        }
      }
    },

    compress: {
      dist: {
        options: {
          archive: "build/index.zip",
          level: 9,
        },
        files: [
          {
            expand: true,
            cwd: "build",
            src: [ "index.html" ],
            dest: "/"
          }
        ]
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true
        }
      }
    },
/*
    watch: {
      dist: {
        files: [ "src/**" ],
        tasks: [ "replace" ],
        options: {
          spawn: false,
        },
      },
    },
*/
  });

  //grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  //grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-processhtml");
  grunt.loadNpmTasks("grunt-replace");

  grunt.registerTask("default", [
    "replace:glsl",
    "replace:dist",
    "uglify",
    "replace:var",
    "cssmin",
    "processhtml",
    "htmlmin",
    "compress",
  ]);
  grunt.registerTask("serve", [ "connect" ]);
}
