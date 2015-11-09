(function(module, undefined){
    "use strict";

    module.exports = function(grunt) {

        var packageFile = 'package.json', //node package file. Do not edit!
            globalMangle = false; //set to true when site is in final QA!

        /**
         * PROJECT NAME
         * If you have run your npm init properly, this will be the same name as the package.
         * Which should be the same name as your theme folders.
         * If you have NOT yet run npm init read this: https://docs.npmjs.com/cli/init
         * Then open terminal and in your project's root folder run npm init.
         *
         * Make sure to include all your custom files in a directory named 'pixafy'.
         * Only those will will be hinted, linted, and minified each time you save them.
         */
        
        var ENTERPRISE_OR_COM = 'rwd', //enterprise, rwd, community, or custom theme folder
            sourceFolder =      'pixafy/', //common dir name that grunt task will perform in
            destFolder =        'min/', //destination folder for minified files.
            cssMinFileName =    'pix.min.css';

        /**
         * Magento Path Variables
         */
        var magento_themePath =     "skin/frontend/"+ENTERPRISE_OR_COM+"/<%= pkg.name %>/", //Magento theme path
            magento_themeCSSDir =   magento_themePath+"css/"+sourceFolder, //skin/.../css/pixafy/
            magento_themeCSS =      magento_themeCSSDir+"*.css", //skin/.../css/pixafy/
            magento_themeSCSS =     magento_themeCSSDir+"*.scss", //skin/.../css/pixafy/
            magento_themeJSDIR =    magento_themePath+"js/", //skin/.../js
            magento_themeJS =       magento_themeJSDIR+sourceFolder+"*.js", //skin/.../js/pixafy/
            magento_jsFolder =      "js/", //Magento JS path
            magento_jsFiles =       magento_jsFolder+sourceFolder+"*.js", //js/pixafy/
            magento_jsModules =     magento_jsFolder+'modules/'+"*.js", //js/modules/
            magento_jsPages =       magento_jsFolder+'pages/**/'+"*.js"; //js/pages/

        /**
         * Wordpress Path Variables
         */
        var wp_themePath =  "wp-content/themes/<%= pkg.name %>/", //Wordpress theme path
            wp_jsPath =     wp_themePath + "js/"+sourceFolder+"*.js",
            wp_cssDir =     wp_themePath + "css/",
            wp_cssPath =    wp_cssDir+sourceFolder+"*.css",
            wp_styleCSS =   wp_themePath + "style.css";

        /**
         * GRUNT Congfiguration.
         * Do NOT edit anything below unless you know Grunt!
         * If something is not working: 
         *     1) Check your path variables
         *     2) If still not working, consult your team's Grunt expert.
         *     3) If still not working, ask Pat.
         */


        /**
         * Array of files and file paths for JsHint
         */
        var hintThese = [
            magento_jsFiles,
            magento_themeJS
        ];

        /**
         * jshint config object
         */
        var hintOpts = {
            options: {
                jshintrc: '.jshintrc'
            },
            grunt:   ['Gruntfile.js'],
            wpjs:    [wp_jsPath],
            modules: [magento_jsModules],
            pages: [magento_jsPages],
            all: hintThese
        };

        /**
         * watchList config object
         */
        var watchList = {
            gruntfile: {
                files: [
                    'Gruntfile.js',
                    '!node_modules/**/*.js',
                    'node_modules/pix-**/*.js',
                    '!node_modules/*/Gruntfile.js'
                ],
                tasks: [
                    'jshint:grunt',
                    'uglify:node_modules',
                    'exec:clear_cache'
                ],
                options: {
                    livereload: true
                }
            },
            wpjs: {
                files: [
                    wp_jsPath
                ],
                tasks: [
                    'jshint:wpjs',
                    'uglify:wpjs',
                    'exec:clear_cache'
                ],
                options: {
                    livereload: true
                }
            },
            modules: {
                files: [
                    magento_jsModules
                ],
                tasks: [
                    'jshint:modules',
                    'uglify:modules',
                    'exec:clear_cache'
                ],
                options: {
                    livereload: true
                }
            },
            pages: {
                files: [
                    magento_jsPages,
                    magento_themeJSDIR+'opcheckout.js'
                ],
                tasks: [
                    'jshint:pages',
                    'uglify:home',
                    'uglify:category',
                    'uglify:product',
                    'uglify:cart',
                    'uglify:checkout',
                    'uglify:account',
                    'exec:clear_cache'
                ],
                options: {
                    livereload: true
                }
            },
            js: {
                files: [
                    magento_themeJS,
                    magento_jsFiles,
                    magento_themeJSDIR+'minicart.js'
                ],
                tasks: [
                    'jshint',
                    'uglify',
                    'exec:clear_cache'
                ],
                options: {
                    livereload: true
                }
            },
            scss: {
                files: [
                    magento_themeSCSS
                ],
                tasks: [
                    'scsslint',
                    'compass'
                ]
            },
            css: {
                files: [
                    wp_cssPath,
                    wp_styleCSS,
                    magento_themeCSS
                ],
                tasks: [
                    'cssmin',
                    'exec'
                ], //'csslint'
                options: {
                    livereload: true
                }
            }
        };

        /**
         * uglify config object.
         */
        var uglify = {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */',
                mangle: {
                    except: [
                        'jQuery',
                        'Prototype'
                    ]
                }
            },
            mage: {
                options: {
                    mangle: false,
                    sourceMap: true //enables source map creation
                },
                files: [
                    { //files that should load in the head
                        src: [
                                magento_jsFolder+'prototype/prototype.js',
                                magento_jsFolder+'mage/translate.js',
                                magento_jsFolder+'mage/cookies.js',
                                magento_jsFolder+'lib/modernizr.custom.js',
                                magento_jsFolder+'lib/jquery/jquery-1.10.2.js',
                                magento_jsFolder+'lib/jquery/noconflict.js'
                        ],
                        dest:   magento_jsFolder+destFolder+'mage.min.js'
                    }
                ]
            },
            my_target: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true //enables source map creation
                },
                files: [
                    {
                        src:    magento_themeJS,
                        dest:   magento_themePath+'js/'+destFolder+'output.min.js'
                    },
                    {
                        src:    magento_jsFiles,
                        dest:   magento_jsFolder+destFolder+'pix.min.js'
                    },
                    { //files that can load at the end of the body
                        src: [
                                magento_jsFolder+'lib/ccard.js',
                                magento_jsFolder+'scriptaculous/builder.js',
                                magento_jsFolder+'scriptaculous/effects.js',
                                magento_jsFolder+'scriptaculous/dragdrop.js',
                                magento_jsFolder+'scriptaculous/controls.js',
                                magento_jsFolder+'scriptaculous/slider.js',
                                magento_jsFolder+'prototype/validation.js',
                                magento_jsFolder+'varien/js.js',
                                magento_jsFolder+'varien/form.js',
                                magento_jsFolder+'varien/menu.js',
                                magento_themeJSDIR+'app.js',
                                magento_themeJSDIR+'msrp.js',
                                magento_themeJSDIR+'msrp_rwd.js',
                                magento_themeJSDIR+'minicart.js',
                                magento_themeJSDIR+'scripts.js'
                        ],
                        dest:   magento_jsFolder+destFolder+'magento.min.js'
                    }
                ]
            },
            requirejs: {
                options: {
                    mangle: false
                },
                files: [
                    { //files that should load in the head
                        src: [
                                magento_jsFolder+'lib/requirejs/require.js',
                                magento_jsFolder+'lib/requirejs/require-config.js'
                        ],
                        dest:   magento_jsFolder+destFolder+'requirejs.min.js'
                    }
                ]
            },
            node_modules: {
                options: {
                    mangle: true,
                    sourceMap: false
                },
                files: [
                    {
                        src: [
                            '!node_modules/**/*.js',
                            'node_modules/pix-**/*.js',
                            '!node_modules/*/Gruntfile.js'
                        ],
                        dest: magento_jsFolder+destFolder+'node-modules.min.js'
                    }
                ]
            },
            modules: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true
                },
                files: [
                    {
                        src: [
                            magento_jsFolder+'modules/*.js',
                            magento_jsFolder+'calendar/calendar-extend.js'
                        ],
                        dest: magento_jsFolder+destFolder+'modules.min.js'
                    }
                ]
            },
            wpjs: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true
                },
                files: [
                    {
                        src:    wp_jsPath,
                        dest:   wp_themePath+'js/'+destFolder+'output.min.js'
                    }
                ]
            },
            home: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true //enables source map creation
                },
                files: [{
                    src: [
                        magento_jsFolder+'pages/home/*.js'
                    ],
                    dest: magento_jsFolder+destFolder+'home.min.js'
                }]
            },
            category: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true //enables source map creation
                },
                files: [{
                    src: [
                        magento_jsFolder+'pages/category/*.js'
                    ],
                    dest: magento_jsFolder+destFolder+'category.min.js'
                }]
            },
            product: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true //enables source map creation
                },
                files: [{
                    src: [
                        magento_jsFolder+'pages/product/*.js'
                    ],
                    dest: magento_jsFolder+destFolder+'product.min.js'
                }]
            },
            cart: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true //enables source map creation
                },
                files: [{
                    src: [
                        magento_jsFolder+'pages/cart/*.js'
                    ],
                    dest: magento_jsFolder+destFolder+'cart.min.js'
                }]
            },
            checkout: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true //enables source map creation
                },
                files: [{
                    src: [
                        magento_jsFolder+'varien/accordion.js',
                        magento_themeJSDIR+'opcheckout.js',
                        magento_jsFolder+'pages/checkout/*.js'
                    ],
                    dest: magento_jsFolder+destFolder+'checkout.min.js'
                }]
            },
            account: {
                options: {
                    mangle: globalMangle,
                    sourceMap: true
                },
                files: [{
                    src: [
                        magento_jsFolder+'pages/account/*.js'
                    ],
                    dest: magento_jsFolder+destFolder+'account.min.js'
                }]
            }
        };

        /**
         * compass config object
         */
        var compassConfig = {
          dist: {                   // Target
            options: {              // Target options
              outputStyle:  'expanded',
              sassDir:      magento_themeCSSDir,
              cssDir:       magento_themeCSSDir
            }
          }
        };

        var scssLintOpts = {
            allFiles: [
                magento_themeSCSS
            ],
            options: {
                exclude: [
                    magento_themeCSSDir+'_fonts.scss',
                    magento_themeCSSDir+'_font_animations.scss',
                    magento_themeCSSDir+'_styles.scss',
                    magento_themeCSSDir+'_mixins.scss',
                    magento_themeCSSDir+'_reset.scss',
                    magento_themeCSSDir+'responsive.scss'
                ],
                config:         '.scss-lint.yml',
                colorizeOutput: true,
                force:          true,
                maxBuffer:      1024*1024
            }
        };

        /**
         * csslint config object
         */
        var lintOpts = {
            files: [
                wp_cssPath,
                wp_styleCSS,
                magento_themeCSS,
                '!**/normalize.min.css'
            ],
            options: {
                'adjoining-classes':            false, //allow adjoining classes
                'box-model' :                   false, //don't throw error on box-sizing
                'box-sizing' :                  false, //don't throw error on box-sizing
                'qualified-headings':           false, //we are using a CMS, client is always liable to add heading tags in odd places.
                'unique-headings':              false, //cannot assume all headings are the same because clients use CMS blocks
                'universal-selector':           false, //ignore star pop hacks
                'star-property-hack':           false, //ignore star pop hacks
                'underscore-property-hack':     false, //ingore this one too
                'regex-selectors':              false, //regex selectors are used in font css files
                'floats':                       false, //no float limit
                'rules-count':                  false, //no rule limit
                'vendor-prefix':                false, //do not require all vender prefixes
                'selector-max':                 4, //5 still seems high, but this is a starting point.

                'unqualified-attributes':       false,
                'display-property-grouping':    false,
                'outline-none':                 false,

                'duplicate-background-images':  false
            }
        };

        /**
         * cssmin config object
         */
        var cssMin = {
            combine: {
                files: [
                    {
                        src:    magento_themeCSS,
                        dest:   magento_themePath+'css/'+destFolder+cssMinFileName
                    },
                    {
                        src:    [wp_cssPath, wp_styleCSS],
                        dest:   wp_themePath+'css/'+destFolder+cssMinFileName
                    }
                ]
            }
        };

        /**
         * Execute npm command line instructions 
         * Used to run cleancss directly instead of using grunt-contrib-cssmin
         * This is to get CSS sourcemaps working.
         */
        var cleanCss = function(dirPath){
            var mgCSS = [],
                path1 = dirPath.replace('<%= pkg.name %>', grunt.config('pkg').name),
                magento_cssmin = 'cleancss --source-map --output '+path1+destFolder+cssMinFileName+' ';

            if( grunt.file.exists(path1+sourceFolder) ){
                grunt.file.recurse(path1+sourceFolder, function callback(abspath) {
                    if( !!~abspath.indexOf('.css') && !~abspath.indexOf('.scss') && !~abspath.indexOf('.css.map') ){
                        mgCSS.push(abspath);
                    }
                });

                mgCSS = mgCSS.join(' ');

                grunt.log.writeln([magento_cssmin+' '+mgCSS]);
                return magento_cssmin+' '+mgCSS;
            }
            return '';
        };
        //run some command line
        var shell = {
            magento_cssmin: { //make the Magento min files
                cmd: function(){
                    return cleanCss(magento_themePath+'css/');
                }
            },
            wp_cssmin: { //make the WP map files
                cmd: function(){
                    return cleanCss(wp_cssDir);
                }
            },
            clear_cache: { //clear cache folder locally
                cmd: function(){
                    var clearing = '';
                    if( grunt.file.exists('var/cache/') ){
                        if (process.platform === "win32") { //node process.platform
                            clearing = 'IF EXIST var\\cache (rmdir var\\cache /s /q)'; //windows clearing cach
                        }
                        else {
                           clearing = 'rm -rf var/cache/*'; //linux unix clear cache folder
                        }
                    }
                    return clearing;
                }
            }
        };

        grunt.log.writeln(["Commence hinting, linting, combing, and minifying!"]);

        /**
         * Grunt Initilazation
         * Pixafy Default Configuration
         */
        grunt.initConfig({
            pkg:        grunt.file.readJSON(packageFile),
            watch:      watchList,
            jshint:     hintOpts,
            uglify:     uglify,
            scsslint:   scssLintOpts,
            compass:    compassConfig,
            csslint:    lintOpts,
            cssmin:     cssMin,
            exec:       shell
        });

        // Load the Grunt plugins.
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-csslint');
        grunt.loadNpmTasks('grunt-scss-lint'); //https://github.com/ahmednuaman/grunt-scss-lint
        grunt.loadNpmTasks('grunt-contrib-compass');
        grunt.loadNpmTasks('grunt-exec');

        // Register the default tasks.
        grunt.registerTask('default', ['watch']);
    };
})(module);
