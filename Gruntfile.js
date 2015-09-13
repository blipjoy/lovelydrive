module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    path: {
      main: "build/app.js",
      min: "build/app.min.js",
      pack: "build/app.pack.js",
    },

    concat: {
      dist: {
        src: [
          "src/progress.js",
          "src/vendors/sonantx.js",
          "src/vendors/motor.js",
          "src/bgm/lovely_drive.js",
          "src/polyfill.js",
          "src/math.js",
          "src/webgl.js",
          "src/fractal.js",
          "src/textures.js",
          "src/scene.js",
          "src/input.js",
          "src/utils.js",
          "src/main.js",
        ],
        dest: "<%= path.main %>"
      }
    },

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
            "document.body.children[1].innerHTML": "\"<%= grunt.file.read('build/glsl/vertex.glsl') %>\"",
            "document.body.children[2].innerHTML": "\"<%= grunt.file.read('build/glsl/fragment.glsl') %>\"",
            "TEXTURE_SIZE": 2048,
            "TEXTURE_MAPW": 2048 / 2 - 16,
            "TEXTURE_MAPH": 2048 / 8 - 16,
            "ASPHALT_TEXTURE_SIZE": 2048 / 2,
            "gl.ONE": 1,
            "gl.TRIANGLES": 4,
            "gl.SRC_ALPHA": 770,
            "gl.ONE_MINUS_SRC_ALPHA": 771,
            "gl.BLEND": 3042,
            "gl.TEXTURE_2D": 3553,
            "gl.UNSIGNED_BYTE": 5121,
            "gl.FLOAT": 5126,
            "gl.RGBA": 6408,
            "gl.LINEAR_MIPMAP_LINEAR": 9987,
            "gl.TEXTURE_MAG_FILTER": 10240,
            "gl.TEXTURE_MIN_FILTER": 10241,
            "gl.COLOR_BUFFER_BIT": 16384,
            "gl.TEXTURE0": 33984,
            "gl.TEXTURE1": 33985,
            "gl.TEXTURE2": 33986,
            "gl.TEXTURE_MAX_ANISOTROPY_EXT": 34046,
            "gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT": 34047,
            "gl.ARRAY_BUFFER": 34962,
            "gl.STATIC_DRAW": 35044,
            "gl.DYNAMIC_DRAW": 35048,
            "gl.FRAGMENT_SHADER": 35632,
            "gl.VERTEX_SHADER": 35633,
            "gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL": 37441,
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
            src: [ "<%= path.main %>" ],
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
          eval: true,
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
          "build/index.min.css": [ "style/index.css", "style/loader.css" ],
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

  grunt.loadNpmTasks("grunt-contrib-concat");
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
    "concat",
    "replace:glsl",
    "replace:dist",
    "uglify",
    "cssmin",
    "processhtml",
    "htmlmin",
    "compress",
  ]);
  grunt.registerTask("serve", [ "connect" ]);
}
